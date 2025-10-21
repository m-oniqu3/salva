import CollectionPreview from "@/components/collection/CollectionPreview";
import { getCollections } from "@utils/api/collections/get-collections";

type Props = {
  username: string;
};

async function CollectionList({ username }: Props) {
  const { data: collections, error } = await getCollections();

  if (error) {
    // Handle specific error cases
    if (error.includes("Unauthorized")) {
      return (
        <p className="text-red-500">
          You must be logged in to view collections.
        </p>
      );
    }

    // Generic error fallback
    return <p className="text-red-500">{error}</p>;
  }

  if (!collections || collections.length == 0) {
    return <p className="wrapper text-center">No collections created yet</p>;
  }

  const previews = collections.map((item) => {
    return (
      <CollectionPreview
        key={item.id}
        username={username}
        collection={{
          ...item,
          //   cover_image: `https://picsum.photos/id/${item.name.length}/400/600`,
        }}
      />
    );
  });

  return (
    <div className="wrapper grid items-center justify-center grid-cols-[repeat(auto-fill,minmax(150px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
      {previews}
    </div>
  );
}

export default CollectionList;
