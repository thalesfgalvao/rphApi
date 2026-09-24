export const calculateDaysBetweenDates = (startDate: Date, endDate: Date) => {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const toTimestamp = (date: Date) => {
    const parts = formatter.formatToParts(date);

    const day = Number(parts.find((part) => part.type === "day")?.value);

    const month = Number(parts.find((part) => part.type === "month")?.value);

    const year = Number(parts.find((part) => part.type === "year")?.value);

    return Date.UTC(year, month - 1, day);
  };

  const startTimestamp = toTimestamp(startDate);
  const endTimestamp = toTimestamp(endDate);

  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return (endTimestamp - startTimestamp) / millisecondsPerDay;
};

export const formatIdentificationDate = (date: Date) => {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return formatter.format(date);
};
