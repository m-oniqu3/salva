import Button from "@/components/Button";
import Image from "next/image";

type Props = {
  username: string;
};

function ProfileSummary({ username }: Props) {
  return (
    <section className="py-4">
      <article className="wrapper flex flex-col gap-4 place-items-center">
        <figure className="">
          <Image
            src="https://i.pinimg.com/736x/64/9b/b6/649bb6629df0875a3e65b2f31f1c40f3.jpg"
            alt={`${username}'s avatar'`}
            width="90"
            height="90"
            className="rounded-full object-cover size-24"
          />
        </figure>

        <div className="flex flex-col items-center">
          <h2 className="font-semibold text-lg">Hagobi Maddison</h2>

          <div className="flex gap-1 font-medium text-sm">
            <p className="text-zinc-500">@{username}</p>
            &#xb7;
            <p className="text-zinc-500">totally spy!</p>
          </div>

          <p className="font-medium text-zinc-500 text-sm">
            {username.length} following
          </p>
        </div>

        <Button className="gray h-10 px-4">Edit Profile</Button>
      </article>
    </section>
  );
}

export default ProfileSummary;
