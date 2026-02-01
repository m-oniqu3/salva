import ErrorState from "@/components/ErrorState";
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

  if (!user) {
    return (
      <ErrorState
        title="Director’s Cut Only"
        message="Sign in to curate your collections like a true cinephile."
        buttonLabel="Sign In"
        link="/login"
      />
    );
  }

  const { data: profile, error } = await getProfile({ id: user.id });

  if (error || !profile) {
    return (
      <ErrorState
        title="The reel broke! 🍿"
        message="We couldn’t load your profile due to a server hiccup. Give it another shot!"
      />
    );
  }

  return (
    <div className="">
      {/* Layout UI */}
      {/* Place children where you want to render a page or nested layout */}
      <AuthNavbar profile={profile} />
      <main className="">{children}</main>
    </div>
  );
}
