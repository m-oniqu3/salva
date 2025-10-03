import CollectionList from "@/components/collection/CollectionList";
import ProfileSummary from "@/components/ProfileSummary";
import getUser from "@/server-actions/get-user";
import { getCollections } from "@utils/api/collections/get-collections";
import { createClient } from "@utils/supabase/server";

import { redirect } from "next/navigation";
type Props = {
  params: Promise<{ profile: string }>;
};

// async function getCollections() {
//   const res = await fetch(`http://localhost:3000/api/collections`);
//   const data = await res.json();
//   return data;
// }
async function page({ params }: Props) {
  const { profile } = await params;
  const supabase = await createClient();
  const { data: user, error } = await getUser(supabase);
  console.log(user);

  if (!user || error) redirect("/login");

  if (!profile) {
    return <div>cannot find this profile</div>;
  }

  const { data: collections, error: collectionsErr } = await getCollections();

  if (collectionsErr) {
    // Handle specific collectionsErr cases
    if (collectionsErr.includes("Unauthorized")) {
      return (
        <p className="text-red-500">
          You must be logged in to view collections.
        </p>
      );
    }

    // Generic error fallback
    return <p className="text-red-500">⚠️ {error}</p>;
  }

  return (
    <div className="space-y-12 pb-10">
      <ProfileSummary username={profile} />
      <CollectionList collections={collections} profile={profile} />
    </div>
  );
}

export default page;
