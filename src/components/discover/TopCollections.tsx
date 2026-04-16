"use client";

import CollectionPreview from "@/components/collection/CollectionPreview";
import ErrorState from "@/components/ErrorState";
import { LoadingIcon } from "@/components/icons";
import { useQuery } from "@tanstack/react-query";
import { getTopCollections } from "@utils/api/collections/get-top-collections";

function TopCollections() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["collections", "top"],
    queryFn: async () => {
      const { data, error } = await getTopCollections();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="error-state-wrapper">
        <LoadingIcon className="size-5 animate-spin" />
      </div>
    );
  }

  // todo: fix error msg
  if (error) {
    return (
      <ErrorState
        heading="Playback error."
        message="We hit a snag fetching your collections."
        className="error-state-wrapper"
      />
    );
  }

  // console.log(data);

  return (
    <section className="flex flex-col gap-4">
      <h3 className="font-medium">Collections</h3>

      <div className="content-grid">
        {data?.map((col) => (
          <CollectionPreview key={col.collection.id} preview={col} />
        ))}
      </div>
    </section>
  );
}

export default TopCollections;
