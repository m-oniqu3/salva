/**
 * Convert any string into a clean, URL-safe slug.
 * Handles punctuation, emojis, accents, and extra spaces.
 *
 * Example:
 * "What do u mean u haven’t seen this??"
 * → "what-do-u-mean-u-havent-seen-this"
 */
export function slugify(text: string): string {
  return text
    .normalize("NFD") // separate accents (é → e +  ́)
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "") // remove punctuation, emojis, symbols
    .replace(/\s+/g, "-") // replace spaces with dashes
    .replace(/-+/g, "-"); // collapse multiple dashes
}

export function unslugify(slug: string) {
  return slug
    .replace(/-/g, " ") // replace dashes with spaces
    .replace(/\s+/g, " ") // clean up extra spaces
    .trim(); // remove leading/trailing spaces
}
