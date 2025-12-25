import CollectionSummary from "@/components/collection/CollectionSummary";
import ErrorState from "@/components/ErrorState";
import getUser from "@/server-actions/get-user";
import { findCollection } from "@utils/api/collections/find-collection";
import { createClient } from "@utils/supabase/server";

type Props = {
  params: Promise<{ profile: string; collection: string }>;
};

async function page({ params }: Props) {
  const { collection: slug, profile: username } = await params;
  const supabase = await createClient();

  const [collection, user] = await Promise.all([
    findCollection(username, slug),
    getUser(supabase),
  ]);

  if (collection.error) {
    return <p>{collection.error}</p>;
  }

  if (!collection.data) {
    return <p>no collection found</p>;
  }

  const {
    user: { user_id: collectionOwnerID },
    collection: { is_private },
  } = collection.data;

  // What's visible to any user? Public collections OR owned private ones.
  const isOwnedByCurrentUser = user.data?.id === collectionOwnerID;
  const canAccess = !is_private || isOwnedByCurrentUser;

  if (!canAccess) {
    return (
      <ErrorState
        title="This page is not available."
        message="Sorry, you can't access this."
        link="/"
        label="Home"
      />
    );
  }

  return (
    <div className="py-8 flex flex-col gap-20">
      <CollectionSummary
        summary={collection.data}
        userID={user.data?.id ?? null}
      />
      <p className="">films for collection</p>
    </div>
  );
}

export default page;
