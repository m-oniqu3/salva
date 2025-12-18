import CollectionSummary from "@/components/collection/CollectionSummary";
import ErrorState from "@/components/ErrorState";
import getUser from "@/server-actions/get-user";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { findCollection } from "@utils/api/collections/find-collection";
import { getFollowers } from "@utils/api/user/get-followers";
import { createClient } from "@utils/supabase/server";

type Props = {
  params: Promise<{ profile: string; collection: string }>;
};

async function page({ params }: Props) {
  const { collection: slug, profile: username } = await params;
  const supabase = await createClient();
  const queryClient = new QueryClient();

  const { data: collection, error } = await findCollection(username, slug);

  if (error) {
    return <p>{error}</p>;
  }

  if (!collection) {
    return <p>no collection found</p>;
  }

  const { data: user } = await getUser(supabase);

  const {
    user: { userID: collectionOwnerID },
    collection: { is_private },
  } = collection;

  //is board private?
  const isPublicCollection = !is_private;
  const isCollectionOwner = user?.id === collectionOwnerID && is_private;

  // the collection is public or the collection is private and the current user owns it
  const isAccessible = isPublicCollection || isCollectionOwner;

  if (!isAccessible) {
    return (
      <ErrorState
        title="This page is not available."
        message="Sorry, you can't access this."
        link="/"
        label="Home"
      />
    );
  }

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["get-followers", collectionOwnerID],
    queryFn: ({ pageParam }) =>
      getFollowers({ targetUserID: collectionOwnerID, page: pageParam }),
    initialPageParam: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="py-8 flex flex-col gap-20">
        <CollectionSummary summary={collection} user={user} />
        <p className="">films for collection</p>
      </div>
    </HydrationBoundary>
  );
}

export default page;
