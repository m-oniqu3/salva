import CollectionSummary from "@/components/collection/CollectionSummary";
import ErrorState from "@/components/ErrorState";
import Films from "@/components/films/Films";
import { UserMeta } from "@/types/user";
import { findCollection } from "@utils/api/collections/find-collection";
import { getProfile } from "@utils/api/profile/get-profile";
import { createClient } from "@utils/supabase/server";
import { canAccessCollection } from "@utils/validation/canAccessCollection";

type Props = {
  params: Promise<{ profile: string; collection: string }>;
};

async function page({ params }: Props) {
  const { profile: username, collection: collection_slug } = await params;

  const supabase = await createClient();

  const [collection, currentUserProfile] = await Promise.all([
    findCollection(username, collection_slug),
    supabase.auth
      .getUser()
      .then((auth) => getProfile({ id: auth.data.user?.id })),
  ]);

  if (collection.error) {
    return (
      <div className="error-state-wrapper">
        <ErrorState
          heading="The director called cut."
          message="There was a problem loading your collections. Try refreshing the page."
        />
      </div>
    );
  }

  if (!collection.data) {
    return (
      <div className="error-state-wrapper">
        <ErrorState
          heading="Scene not found."
          message="This collection doesn’t exist — or it’s no longer available to view."
        />
      </div>
    );
  }

  const {
    user: { user_id: collectionOwnerID },
    collection: { id, is_private },
  } = collection.data;

  const canAccess = canAccessCollection({
    collectionOwnerID: collectionOwnerID,
    isPrivate: is_private,
    currentUserID: currentUserProfile.data?.user_id,
  });

  if (!canAccess) {
    return (
      <div className="error-state-wrapper">
        <ErrorState
          heading="This page is not available."
          message="Sorry, you can't access this."
          link="/"
          buttonLabel="Home"
        />
      </div>
    );
  }

  const user = currentUserProfile.data;

  const currentUser: UserMeta = user
    ? { userID: user.user_id, username: user?.username }
    : null;

  return (
    <div className="pages">
      <CollectionSummary
        summary={collection.data}
        userID={user?.user_id ?? null}
      />
      <Films
        user={currentUser}
        targetUser={{ userID: collectionOwnerID, collectionID: id }}
      />
    </div>
  );
}

export default page;
