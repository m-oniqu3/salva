import CollectionPreview from "@/components/collection/CollectionPreview";
import { Collection } from "@/types/collection";

type Props = {
  collections: Array<Collection> | null;
  profile: string;
};

function CollectionList({ collections, profile }: Props) {
  if (!collections || collections.length == 0) {
    return <p className="wrapper text-center">No collections created yet</p>;
  }

  const previews = collections.map((item) => {
    return (
      <CollectionPreview
        key={item.id}
        profile={profile}
        collection={{
          ...item,
          //   cover_image: `https://picsum.photos/id/${item.name.length}/400/600`,
        }}
      />
    );
  });

  return (
    <div className="wrapper grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 ">
      {previews}
    </div>
  );
}

export default CollectionList;
