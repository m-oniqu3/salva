import { CollectionMeta } from "@/types/collection";
import { useMemo } from "react";

type Props = {
  allCollections: CollectionMeta[] | null;
  savedCollections: CollectionMeta[] | undefined;
  searchQuery: string;
};

function useFilteredCollections(props: Props) {
  const { allCollections, savedCollections, searchQuery } = props;
  return useMemo(() => {
    if (!allCollections) {
      return { available: [], saved: [] };
    }

    const searchLower = searchQuery.toLowerCase().trim();

    // Filter function
    const matchesSearch = (collection: CollectionMeta) =>
      !searchQuery || collection.name.toLowerCase().includes(searchLower);

    // Saved collections (from server)
    const saved = (savedCollections ?? []).filter(matchesSearch);

    // Available collections (not in saved)
    const savedIDsSet = new Set(savedCollections?.map((c) => c.id) ?? []);
    const available = allCollections
      .filter((c) => !savedIDsSet.has(c.id))
      .filter(matchesSearch);

    return { available, saved };
  }, [allCollections, savedCollections, searchQuery]);
}

export default useFilteredCollections;
