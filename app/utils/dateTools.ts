export function dateTimeToString(date: string) {
  const dateString = new Date(date);
  return dateString
    .toLocaleString("en-GB", { timeZone: "Asia/Almaty" })
    .toString();
}
export function getTimeDifference(start: Date, end: Date) {
  return end.getTime() - start.getTime();
}

export function timeStampToTimeDifference(timeStamp: number): string {
  let delta = Math.abs(timeStamp) / 1000;
  const days = Math.floor(delta / 86400);
  delta -= days * 86400;
  let hours = Math.floor(delta / 3600) % 24;
  return `${days}/${hours}`;
}
