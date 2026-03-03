import getUser from "@/server-actions/get-user";
import { getProfile } from "@utils/api/profile/get-profile";
import { createClient } from "@utils/supabase/server";
import Link from "next/link";

async function DefaultNavbar() {
  const supabase = await createClient();
  const { data: user } = await getUser(supabase);

  let username;

  if (user) {
    const { data } = await getProfile({
      key: "user_id",
      value: user?.id,
    });

    if (data) {
      username = data.username;
    }
  }

  //todo : handle error case when there is no profile

  return (
    <div>
      DefaultNavbar
      <u className="flex gap-4 p-4">
        <Link href="/home">Home</Link>
        {username ? (
          <Link href={`/${username}`}>Profile</Link>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </u>
    </div>
  );
}

export default DefaultNavbar;
