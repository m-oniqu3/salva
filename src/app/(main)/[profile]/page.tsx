import CollectionList from "@/components/collection/CollectionList";
import ProfileSummary from "@/components/ProfileSummary";
import getUser from "@/server-actions/get-user";
import { getProfile } from "@utils/api/profile/get-profile";
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
  const { profile: username } = await params;

  if (!username) redirect("/");

  const supabase = await createClient();

  const [profileDetails, userDetails] = await Promise.all([
    getProfile({ username }),
    getUser(supabase),
  ]);

  const { data: user } = userDetails;
  const { data: profile } = profileDetails;

  const userID = user?.id ?? null;

  if (!profile) {
    return <div>Profile does not exist </div>;
  }

  return (
    <div className="flex flex-col py-8 gap-20 ">
      <ProfileSummary profile={profile} userID={userID} />
      <CollectionList username={username} />
    </div>
  );
}

export default page;
