import AuthNavbar from "@/components/nav/AuthNavbar";
import getUser from "@/server-actions/get-user";
import { getProfile } from "@utils/api/profile/get-profile";
import { createClient } from "@utils/supabase/server";

import { redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

// check for user here

export default async function MainLayout({ children }: Props) {
  const supabase = await createClient();
  const { data: user } = await getUser(supabase);

  const { data: profile, error } = await getProfile({
    username: null,
    id: user?.id,
  });

  console.log(profile);

  //todo : handle error case when there is no profile

  if (error) {
    return redirect("/");
  }

  return (
    <>
      {/* Layout UI */}
      {/* Place children where you want to render a page or nested layout */}
      <AuthNavbar profile={profile} />
      <main>{children}</main>
    </>
  );
}
