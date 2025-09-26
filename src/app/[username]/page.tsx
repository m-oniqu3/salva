const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type Props = {
  params: {
    username: string;
  };
};

async function ProfilePage({ params }: Props) {
  await delay(100);
  const { username } = await params;
  return <p>{username}</p>;
}

export default ProfilePage;
