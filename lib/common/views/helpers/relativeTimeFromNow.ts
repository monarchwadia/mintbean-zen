import { formatDistance, subDays } from "date-fns"

export const relativeTimeFromNow = (date: Date) => 
  formatDistance(date, new Date(), { addSuffix: true })


