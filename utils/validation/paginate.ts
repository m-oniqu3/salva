/**
 * Returns a range of numbers to be used for pagination.
 */
export function calculateRange(page: number, limit: number): Array<number> {
  const start = page * limit;
  const end = start + limit - 1;

  return [start, end];
}
