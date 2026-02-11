import CollectionPreview from "@/components/collection/CollectionPreview";
import ErrorState from "@/components/ErrorState";
import { getCollections } from "@utils/api/collections/get-collections";

type Props = {
  username: string;
  isCollectionOwner: boolean;
};

async function Collections(props: Props) {
  const { username, isCollectionOwner } = props;
  const { data: collections, error } = await getCollections(username);

  if (error) {
    return (
      <ErrorState
        heading="Playback error."
        message="We hit a snag fetching your collections. Don’t worry — the show isn’t over."
      />
    );
  }

  if (!collections || collections.length === 0) {
    return (
      <ErrorState
        heading="Nothing on screen"
        message={
          isCollectionOwner
            ? `You haven’t created any collections yet.`
            : `This user hasn’t shared any collections yet`
        }
      />
    );
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

  return <div className="content-grid">{previews}</div>;
}

export default Collections;
