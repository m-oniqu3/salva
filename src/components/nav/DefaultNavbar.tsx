import getUser from "@/server-actions/get-user";
import { getProfile } from "@utils/api/profile/get-profile";
import { createClient } from "@utils/supabase/server";
import Link from "next/link";

async function DefaultNavbar() {
  const supabase = await createClient();
  const { data: user } = await getUser(supabase);

  const { data: profile, error } = await getProfile({
    username: null,
    id: user?.id,
  });

  console.log("default nav", profile, error);

  //todo : handle error case when there is no profile

  return (
    <div>
      DefaultNavbar
      <u className="flex gap-4 p-4">
        <Link href="/home">Home</Link>
        <Link href={`/${profile?.username || "bococo"}`}>Profile</Link>
      </u>
    </div>
  );
}

export default DefaultNavbar;
