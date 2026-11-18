type CalendarEvent = {
  title: string;
  description: string;
  start: string;
  end?: string;
  location: string;
  uid: string;
};

function escapeCalendarText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function calendarDate(value: string | Date) {
  return new Date(value)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

// RFC 5545 limits each physical line to 75 UTF-8 bytes, including continuation spaces.
function foldCalendarLine(line: string) {
  const encoder = new TextEncoder();
  let result = "";
  let bytes = 0;

  for (const character of line) {
    const length = encoder.encode(character).length;
    if (bytes + length > 75) {
      result += "\r\n ";
      bytes = 1;
    }
    result += character;
    bytes += length;
  }

  return result;
}

export function buildCalendar(event: CalendarEvent, now = new Date()) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//XV Invitation//ES",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${escapeCalendarText(event.uid)}`,
    `DTSTAMP:${calendarDate(now)}`,
    `DTSTART:${calendarDate(event.start)}`,
    ...(event.end ? [`DTEND:${calendarDate(event.end)}`] : []),
    `SUMMARY:${escapeCalendarText(event.title)}`,
    `DESCRIPTION:${escapeCalendarText(event.description)}`,
    `LOCATION:${escapeCalendarText(event.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.map(foldCalendarLine).join("\r\n") + "\r\n";
}
