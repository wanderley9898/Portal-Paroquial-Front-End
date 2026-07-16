import type { AuthUser } from "./types";

const TOKEN_KEY = "dtn_token";
const USER_KEY = "dtn_user";

let memoryToken: string | null = null;
let memoryUser: AuthUser | null = null;

function safeStorageGet(storage: Storage, key: string) {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(storage: Storage, key: string, value: string) {
  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeStorageRemove(storage: Storage, key: string) {
  try {
    storage.removeItem(key);
  } catch {
    // no-op
  }
}

export function saveSession(token: string, user: AuthUser) {
  const serializedUser = JSON.stringify(user);

  const savedInSession =
    safeStorageSet(sessionStorage, TOKEN_KEY, token) &&
    safeStorageSet(sessionStorage, USER_KEY, serializedUser);

  if (savedInSession) {
    safeStorageRemove(localStorage, TOKEN_KEY);
    safeStorageRemove(localStorage, USER_KEY);
    memoryToken = null;
    memoryUser = null;
    return;
  }

  const savedInLocal =
    safeStorageSet(localStorage, TOKEN_KEY, token) &&
    safeStorageSet(localStorage, USER_KEY, serializedUser);

  if (savedInLocal) {
    memoryToken = null;
    memoryUser = null;
    return;
  }

  memoryToken = token;
  memoryUser = user;
}

export function clearSession() {
  safeStorageRemove(sessionStorage, TOKEN_KEY);
  safeStorageRemove(sessionStorage, USER_KEY);
  safeStorageRemove(localStorage, TOKEN_KEY);
  safeStorageRemove(localStorage, USER_KEY);
  memoryToken = null;
  memoryUser = null;
}

export function getToken() {
  return (
    safeStorageGet(sessionStorage, TOKEN_KEY) ||
    safeStorageGet(localStorage, TOKEN_KEY) ||
    memoryToken
  );
}

export function getStoredUser(): AuthUser | null {
  const raw =
    safeStorageGet(sessionStorage, USER_KEY) ||
    safeStorageGet(localStorage, USER_KEY);

  if (!raw) return memoryUser;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return memoryUser;
  }
}
