import { format } from "date-fns";

const formatDisplayDate = (value?: string) => {
  if (!value) return "Selecionar data";

  return format(new Date(value), "dd/MM/yyyy");
};

const parseFilterDate = (value?: string) => {
  if (!value) return undefined;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

function formatDateTimeLocal(value?: string) {
  if (!value) return "";

  const date = new Date(value);

  const pad = (n: number) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export { formatDateTimeLocal, formatDisplayDate, parseFilterDate };
