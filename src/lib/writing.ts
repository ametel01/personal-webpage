const writingDateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "long",
  timeZone: "UTC"
});

export function formatWritingDate(date: string) {
  return writingDateFormatter.format(new Date(`${date}T00:00:00Z`));
}
