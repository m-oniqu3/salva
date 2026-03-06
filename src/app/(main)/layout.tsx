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

  if (!user) redirect("/");

  // if no user then i dont want to fetch the profile

  const { data: profile } = await getProfile({
    key: "user_id",
    value: user.id,
  });

  if (!profile) redirect("/");

  return (
    <div className="flex flex-col gap-8 pb-20">
      <AuthNavbar profile={profile} />
      <main className="wrapper ">{children}</main>
    </div>
  );
}
