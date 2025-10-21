import AuthNavbar from "@/components/nav/AuthNavbar";
import getUser from "@/server-actions/get-user";
import { createClient } from "@utils/supabase/server";

type Props = {
  children: React.ReactNode;
};

// check for user here

export default async function MainLayout({ children }: Props) {
  const supabase = await createClient();
  const { data: user } = await getUser(supabase);

  return (
    <>
      {/* Layout UI */}
      {/* Place children where you want to render a page or nested layout */}
      <AuthNavbar user={user} />
      <main>{children}</main>
    </>
  );
}
