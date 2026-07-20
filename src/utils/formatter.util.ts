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

export { formatDisplayDate, parseFilterDate };
