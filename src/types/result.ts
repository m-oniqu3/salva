export type Result<T> = Promise<{
  data: T | null;
  error: string | null;
}>;
