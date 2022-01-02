import { formatDistance, formatRFC7231, subDays } from "date-fns"

export const relativeTimeFromNow = (date: Date) => 
  formatDistance(date, new Date(), { addSuffix: true })

export const formatDatetime = (date: Date) => formatRFC7231(date)
