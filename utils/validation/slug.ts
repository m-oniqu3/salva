export function slugify(str: string) {
  return str
    .trim() // remove extra spaces
    .toLowerCase() // make lowercase
    .replace(/\s+/g, "-"); // replace spaces with dashes
  // .replace(/[^\w-]/g, ""); // remove non-alphanumeric characters (optional)
}

export function unslugify(slug: string) {
  return slug
    .replace(/-/g, " ") // replace dashes with spaces
    .replace(/\s+/g, " ") // clean up extra spaces
    .trim(); // remove leading/trailing spaces
}
