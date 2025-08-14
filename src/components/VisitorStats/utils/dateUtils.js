export const getDateRange = (type, offset = 0) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (type === "day") {
    const day = new Date(today);
    day.setDate(day.getDate() - offset);
    return {
      start: new Date(day),
      end: new Date(day.setHours(23, 59, 59, 999)),
    };
  }

  if (type === "week") {
    const currentDay = today.getDay();
    const diffToMonday = (currentDay + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMonday - offset * 7);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return { start: monday, end: sunday };
  }

  if (type === "month") {
    const first = new Date(today.getFullYear(), today.getMonth() - offset, 1);
    const last = new Date(
      today.getFullYear(),
      today.getMonth() - offset + 1,
      0,
      23,
      59,
      59,
      999
    );
    return { start: first, end: last };
  }

  return { start: today, end: today };
};

export const formatDateKey = (type, offset = 0) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (type === "day") {
    const target = new Date(today);
    target.setDate(today.getDate() - offset);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (offset === 0) return "I dag";
    if (offset === 1) return "I går";

    return target.toLocaleDateString("no-NO", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }

  if (type === "week") {
    if (offset === 0) return "Denne uken";
    const weekStart = getDateRange("week", offset).start;

    const week = getWeekNumber(weekStart);
    return `Uke ${week}`;
  }

  if (type === "month") {
    if (offset === 0) return "Denne måneden";
    const date = new Date();
    date.setMonth(date.getMonth() - offset);
    return date.toLocaleDateString("no-NO", {
      month: "long",
      year: "numeric",
    });
  }

  return "";
};

const getWeekNumber = (d) => {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};
