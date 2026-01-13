import { useQuery } from "@tanstack/react-query";
import { findCollection } from "@utils/api/collections/find-collection";

function useFindCollection(username: string, slug: string) {
  const q = useQuery({
    queryKey: ["collection", "find", `/${username}/${slug}`],
    queryFn: () => findCollection(username, slug),
    enabled: !!username && !!slug,
  });

  return q;
}

export default useFindCollection;
