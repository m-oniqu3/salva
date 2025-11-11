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
    return <p className="wrapper text-center">No collections created yet</p>;
  }

  console.log(collections);

  const previews = collections.map((item) => {
    console.log(item);
    return (
      <CollectionPreview key={item.id} username={username} preview={item} />
    );
  });

  return (
    <div className="wrapper grid items-center justify-center grid-cols-[repeat(auto-fill,minmax(150px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
      {previews}
    </div>
  );
}

export default CollectionList;
