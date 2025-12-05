import CollectionSummary from "@/components/collection/CollectionSummary";
import getUser from "@/server-actions/get-user";
import { findCollection } from "@utils/api/collections/find-collection";
import { createClient } from "@utils/supabase/server";

type Props = {
  params: Promise<{ profile: string; collection: string }>;
};

async function page({ params }: Props) {
  const { collection: slug, profile: username } = await params;
  const supabase = await createClient();

  const { data: collection, error } = await findCollection(username, slug);

  if (error) {
    return <p>{error}</p>;
  }

  if (!collection) {
    return <p>no collection found</p>;
  }

  const { data: user } = await getUser(supabase);

  //is board private?

  return (
    <div className="py-8 flex flex-col gap-20">
      <CollectionSummary summary={collection} user={user} />
      <p className="">films for collection</p>
    </div>
  );
}

export default page;
