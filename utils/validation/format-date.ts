// utils/format-time.ts
import { formatDistanceToNow } from "date-fns";

export function formatTimeAgo(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
    .replace("about ", "") // "about 2 hours ago" → "2 hours ago"
    .replace(" hours", "h") // "2 hours ago" → "2h ago"
    .replace(" hour", "h") // "1 hour ago" → "1h ago"
    .replace(" minutes", "m") // "5 minutes ago" → "5m ago"
    .replace(" minute", "m") // "1 minute ago" → "1m ago"
    .replace(" days", "d") // "3 days ago" → "3d ago"
    .replace(" day", "d") // "1 day ago" → "1d ago"
    .replace(" months", "mo") // "2 months ago" → "2mo ago"
    .replace(" month", "mo") // "1 month ago" → "1mo ago"
    .replace(" years", "y") // "2 years ago" → "2y ago"
    .replace(" year", "y") // "1 year ago" → "1y ago"
    .replace("less than am ago", "just now"); // edge case
}
