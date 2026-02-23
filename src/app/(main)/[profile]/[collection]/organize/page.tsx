import OrganizeCollection from "@/components/collection/OrganizeCollection";
import ErrorState from "@/components/ErrorState";
import { findCollection } from "@utils/api/collections/find-collection";
import { checkUser } from "@utils/api/user/check-user";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ profile: string; collection: string }>;
};

async function page({ params }: Props) {
  const { profile: username, collection: collection_slug } = await params;

  // Check if the user can access this page
  const isCurrentUser = await checkUser(username);
  if (!isCurrentUser) redirect("/");

  const { data, error } = await findCollection(username, collection_slug);

  if (error) {
    return (
      <ErrorState
        heading="The Archives Are Acting Up"
        message="We ran into an error while loading this collection. It might be temporary — try again shortly."
        className="error-state-wrapper"
      />
    );
  }

  if (!data) {
    return (
      <ErrorState
        heading="Nothing in the Archives"
        message="Your saved films will appear here once you start collecting."
        className="error-state-wrapper"
      />
    );
  }

  return (
    <div>
      <OrganizeCollection collection={data} />
    </div>
  );
}

export default page;
