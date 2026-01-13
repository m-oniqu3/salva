import ProfileSnippet from "@/components/profile/ProfileSnippet";
import { findProfiles } from "@utils/api/profile/find-profiles";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

async function page({ params }: Props) {
  const { slug } = await params;

  if (!slug) {
    console.log("No user present to search");
    redirect("/");
  }

  const { data, error } = await findProfiles(slug);

  if (error) {
    return <p>Error getting profiles</p>;
  }

  if (!data || data.length == 0) {
    return <p>No profiles found.</p>;
  }
  console.log(data);

  const rendered_profiles = data.map((profile) => {
    return <ProfileSnippet key={profile.id} profile={profile} />;
  });

  return (
    <ul className="grid sm:grid-cols-2 gap-12 md:grid-cols-3  xl:grid-cols-4">
      {rendered_profiles}
    </ul>
  );
}

export default page;
