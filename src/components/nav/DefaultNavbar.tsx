import getUser from "@/server-actions/get-user";
import { getProfile } from "@utils/api/profile/get-profile";
import { createClient } from "@utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

async function DefaultNavbar() {
  const supabase = await createClient();
  const { data: user } = await getUser(supabase);

  const { data: profile, error } = await getProfile({
    username: null,
    id: user?.id,
  });

  console.log(profile);

  //todo : handle error case when there is no profile

  if (error || !profile) {
    return redirect("/");
  }

  return (
    <div>
      DefaultNavbar
      <u className="flex gap-4 p-4">
        <Link href="/home">Home</Link>
        <Link href={`/${profile.username}`}>Profile</Link>
      </u>
    </div>
  );
}

export default DefaultNavbar;
