import CollectionPreview from "@/components/collection/CollectionPreview";
import { getCollections } from "@utils/api/collections/get-collections";

type Props = {
  username: string;
};

async function CollectionList({ username }: Props) {
  const { data: collections, error } = await getCollections(username);

  //todo : fix this by removing the unauthorized case
  if (error) {
    console.log(error);
    return <p className="text-red-500">{error}</p>;
  }

  if (!collections || collections.length == 0) {
    return <p className="">No collections created yet.</p>;
  }

  const previews = collections.map((item) => {
    return (
      <CollectionPreview
        key={item.id}
        username={username}
        preview={{
          ...item,
          // cover_image: `https://picsum.photos/id/${item.id}/500/500`,
        }}
      />
    );
  });

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 sm:gap-16 lg:grid-cols-3 xl:grid-cols-4 ">
      {previews}
    </div>
  );
}

export default CollectionList;
