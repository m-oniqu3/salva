import { CollectionMeta } from "@/types/collection";
import { useMemo } from "react";

type Props = {
  collections: CollectionMeta[] | null;
  targetCollectionIDs: number[];
  searchQuery: string;
};

function useFilteredCollections(props: Props) {
  const { collections, targetCollectionIDs, searchQuery } = props;

  return useMemo(() => {
    if (!collections || collections.length === 0) {
      return {
        available: [],
        filled: [],
      };
    }

    const searchLower = searchQuery.toLowerCase().trim();

    // Filter function
    const matchesSearch = (collection: CollectionMeta) =>
      !searchQuery || collection.name.toLowerCase().includes(searchLower);

    // Saved collections (from server)

    const filledIDs = new Set(targetCollectionIDs);
    const filledCollections = collections
      .filter((col) => filledIDs.has(col.id) ?? [])
      .filter(matchesSearch);

    // Available collections (not in target)

    const available = collections
      .filter((c) => !filledIDs.has(c.id))
      .filter(matchesSearch);

    return { available, filled: filledCollections };
  }, [collections, targetCollectionIDs, searchQuery]);
}

export default useFilteredCollections;
