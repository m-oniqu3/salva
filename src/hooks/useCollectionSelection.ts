import { useEffect, useMemo, useRef, useState } from "react";

function useCollectionSelection(originalIDs: number[]) {
  // Single source of truth: current selected IDs
  const [selectedIDs, setSelectedIDs] = useState<Set<number>>(new Set());
  const originalSet = useRef<Set<number>>(new Set());

  // Initialize when originalIDs loads/changes
  useEffect(() => {
    const ids = new Set(originalIDs);
    setSelectedIDs(ids);
    originalSet.current = ids;
  }, [originalIDs]);

  // Compute changes (derived state, not stored)
  const changes = useMemo(() => {
    const toAdd = [...selectedIDs].filter((id) => !originalSet.current.has(id));
    const toRemove = [...originalSet.current].filter(
      (id) => !selectedIDs.has(id),
    );

    return { toAdd, toRemove };
  }, [selectedIDs]);

  const hasChanges = changes.toAdd.length > 0 || changes.toRemove.length > 0;

  // Toggle function
  function toggle(id: number) {
    setSelectedIDs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function reset(newIDs: number[]) {
    const ids = new Set(newIDs);
    setSelectedIDs(ids);
    originalSet.current = ids;
  }

  return {
    selectedIDs,
    reset,
    changes,
    hasChanges,
    toggle,
  };
}

export default useCollectionSelection;
