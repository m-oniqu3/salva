import CollectionSummary from "@/components/collection/CollectionSummary";
import ErrorState from "@/components/ErrorState";
import AllFilms from "@/components/films/AllFilms";
import { findCollection } from "@utils/api/collections/find-collection";
import { getProfile } from "@utils/api/profile/get-profile";
import { createClient } from "@utils/supabase/server";

type Props = {
  params: Promise<{ profile: string; collection: string }>;
};

async function page({ params }: Props) {
  const { collection: slug, profile: username } = await params;
  const supabase = await createClient();

  const [collection, authUserProfile] = await Promise.all([
    findCollection(username, slug),
    supabase.auth
      .getUser()
      .then((auth) => getProfile({ id: auth.data.user?.id })),
  ]);

  if (collection.error || !collection.data) {
    return <p>no collection found</p>;
  }

  const {
    user: { user_id: collectionOwnerID },
    collection: { id, is_private },
  } = collection.data;

  // What's visible to any user? Public collections OR owned private ones.
  const isOwnedByCurrentUser =
    authUserProfile.data?.user_id === collectionOwnerID;
  const canAccess = !is_private || isOwnedByCurrentUser;

  if (!canAccess) {
    return (
      <ErrorState
        title="This page is not available."
        message="Sorry, you can't access this."
        link="/"
        buttonLabel="Home"
      />
    );
  }

  return (
    <div className="py-8 flex flex-col gap-20">
      <CollectionSummary
        summary={collection.data}
        userID={authUserProfile.data?.user_id ?? null}
      />
      <AllFilms
        user={
          authUserProfile.data
            ? {
                id: authUserProfile.data.user_id,
                username: authUserProfile.data.username,
              }
            : null
        }
        target={{ userID: collectionOwnerID, collectionID: id }}
      />
    </div>
  );
}

export default page;
