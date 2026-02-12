import AuthNavbar from "@/components/nav/AuthNavbar";
import getUser from "@/server-actions/get-user";
import { getProfile } from "@utils/api/profile/get-profile";
import { createClient } from "@utils/supabase/server";

type Props = {
  children: React.ReactNode;
};

// check for user here

export default async function MainLayout({ children }: Props) {
  const supabase = await createClient();
  const { data: user } = await getUser(supabase);

  // if no user then i dont want to fetch the profile

  let profile = null;

  if (user) {
    const { data } = await getProfile({ id: user.id });

    if (data) profile = data;
  }

  return (
    <div className="flex flex-col gap-8 pb-20">
      <AuthNavbar profile={profile} />
      <main className="wrapper ">{children}</main>
    </div>
  );
}
