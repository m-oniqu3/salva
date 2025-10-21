export function slugify(str: string) {
  return str
    .trim() // remove extra spaces
    .toLowerCase() // make lowercase
    .replace(/\s+/g, "-") // replace spaces with dashes
    .replace(/[^\w-]/g, ""); // remove non-alphanumeric characters (optional)
}
