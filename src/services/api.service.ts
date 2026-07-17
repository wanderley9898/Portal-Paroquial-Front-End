import { getToken } from "../auth/session";
import { BASE_API_URL } from "../constants/envs";

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ApiRequestOptions = {
  method?: RequestMethod;
  body?: unknown;
  params?: Record<string, unknown>;
};

type UploadProgressOptions = {
  method?: RequestMethod;
  body: FormData;
  onUploadProgress?: (progress: number) => void;
};

function toFriendlyApiMessage(rawMessage: string) {
  const normalized = rawMessage.trim();

  const knownMessages: Record<string, string> = {
    "Usuário ja esta vinculado a campanha.": "Esse jogador ja esta vinculado a campanha.",
    "Ficha ja esta vinculada a campanha.": "Essa ficha ja esta vinculada a campanha.",
    "Código de jogador nao encontrado.": "Nao encontramos esse código de jogador.",
  };

  return knownMessages[normalized] || normalized;
}

function parseApiErrorMessage(status: number, fallbackText: string) {
  const trimmedText = fallbackText.trim();

  if (!trimmedText) {
    return "Erro ao processar requisição";
  }

  try {
    const parsed = JSON.parse(trimmedText) as {
      message?: string | string[];
      error?: string;
      statusCode?: number;
    };

    if (Array.isArray(parsed.message) && parsed.message.length > 0) {
      return toFriendlyApiMessage(parsed.message.join(" "));
    }

    if (typeof parsed.message === "string" && parsed.message.trim()) {
      return toFriendlyApiMessage(parsed.message);
    }

    if (typeof parsed.error === "string" && parsed.error.trim()) {
      return toFriendlyApiMessage(parsed.error);
    }
  } catch {
    // fallback to plain text below
  }

  if (trimmedText.startsWith("{") && trimmedText.endsWith("}")) {
    if (status === 409) {
      return "Não foi possível concluir essa operação porque o registro ja existe.";
    }

    return "Não foi possível processar a solicitação.";
  }

  return toFriendlyApiMessage(trimmedText);
}

function hasJsonResponse(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  return contentType.includes("application/json");
}

function buildUrlWithParams(path: string, params?: Record<string, unknown>) {
  if (!params) {
    return path;
  }

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== "") {
          searchParams.append(key, String(item));
        }
      });
      return;
    }

    searchParams.append(key, String(value));
  });

  const queryString = searchParams.toString();
  if (!queryString) {
    return path;
  }

  return `${path}${path.includes("?") ? "&" : "?"}${queryString}`;
}

export async function apiRequest<T>(
  path: string,
  { method = "GET", body, params }: ApiRequestOptions = {},
): Promise<T> {
  const token = getToken();
  const isFormData = body instanceof FormData;
  const finalPath = buildUrlWithParams(path, params);

  const response = await fetch(`${BASE_API_URL}${finalPath}`, {
    method,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(parseApiErrorMessage(response.status, text || "Erro ao processar requisição"));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  if (!hasJsonResponse(response)) {
    return text as T;
  }

  return JSON.parse(text) as T;
}

export function apiRequestWithUploadProgress<T>(
  path: string,
  { method = "POST", body, onUploadProgress }: UploadProgressOptions,
): Promise<T> {
  const token = getToken();

  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, `${BASE_API_URL}${path}`);

    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    xhr.upload.onprogress = (event) => {
      if (!onUploadProgress) return;

      if (!event.lengthComputable || event.total === 0) {
        onUploadProgress(0);
        return;
      }

      const progress = Math.max(0, Math.min(100, Math.round((event.loaded / event.total) * 100)));

      onUploadProgress(progress);
    };

    xhr.onerror = () => {
      reject(new Error("Falha de rede ao enviar arquivo."));
    };

    xhr.onload = () => {
      const text = xhr.responseText || "";

      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(parseApiErrorMessage(xhr.status, text || "Erro ao processar requisição")));
        return;
      }

      if (xhr.status === 204) {
        resolve(undefined as T);
        return;
      }

      try {
        resolve(JSON.parse(text) as T);
      } catch {
        reject(new Error("Resposta inválida do servidor."));
      }
    };

    xhr.send(body);
  });
}

export const api = {
  request: apiRequest,
  requestWithUploadProgress: apiRequestWithUploadProgress,
  get<T>(path: string, options: Omit<ApiRequestOptions, "method" | "body"> = {}) {
    return apiRequest<T>(path, { ...options, method: "GET" });
  },
  post<T>(path: string, body?: unknown, params?: Record<string, unknown>) {
    return apiRequest<T>(path, { method: "POST", body, params });
  },
  put<T>(path: string, body?: unknown, params?: Record<string, unknown>) {
    return apiRequest<T>(path, { method: "PUT", body, params });
  },
  patch<T>(path: string, body?: unknown, params?: Record<string, unknown>) {
    return apiRequest<T>(path, { method: "PATCH", body, params });
  },
  delete<T>(path: string, options: Omit<ApiRequestOptions, "method" | "body"> = {}) {
    return apiRequest<T>(path, { ...options, method: "DELETE" });
  },
};
