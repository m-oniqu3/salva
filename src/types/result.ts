export type Result<T> = Promise<{
  data: T;
  error: string | null;
}>;
