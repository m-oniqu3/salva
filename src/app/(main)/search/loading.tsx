export default function Loading() {
  return (
    <ul className="grid grid-cols-2 gap-12 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <li
          key={i}
          className="size-full aspect-[3/4] animate-pulse rounded-lg gray"
        />
      ))}
    </ul>
  );
}
