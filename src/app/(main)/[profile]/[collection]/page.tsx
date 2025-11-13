import CollectionSummary from "@/components/collection/CollectionSummary";
import { findCollection } from "@utils/api/collections/find-collection";

type Props = {
  params: Promise<{ profile: string; collection: string }>;
};

async function page({ params }: Props) {
  const { collection: slug, profile: username } = await params;

  //clean up slug;
  const collection_name = decodeURIComponent(slug);

  console.log(collection_name);
  const { data: collection, error } = await findCollection(username, slug);

  if (error) {
    return <p>{error}</p>;
  }

  if (!collection) {
    return <p>no collection found</p>;
  }

  return (
    <div className="py-8">
      <CollectionSummary summary={collection} />
      <p>films for collection</p>
    </div>
  );
}

export default page;
