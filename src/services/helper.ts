import dayjs from "dayjs";

export const FORMATE_DATE = "YYYY-MM-DD";

export const dateRangeValidate = (dateRange: any) => {
  if (!dateRange) return undefined;

  const startDate = dayjs(dateRange[0], FORMATE_DATE).toDate();
  const endDate = dayjs(dateRange[1], FORMATE_DATE).toDate();

  return [startDate, endDate];
};
export const toVND = (value: any) => {
  value = value.toString().replace(/\./g, "");
  const formatted = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "VND",
  })
    .format(value)
    .replace("₫", "")
    .trim();

  return formatted;
};
