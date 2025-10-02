import ProfileSummary from "@/components/ProfileSummary";
type Props = {
  params: { profile: string };
};

async function page(props: Props) {
  const { profile } = await props.params;

  return (
    <div>
      <ProfileSummary username={profile} />
      <p>{profile}</p>
    </div>
  );
}

export default page;
