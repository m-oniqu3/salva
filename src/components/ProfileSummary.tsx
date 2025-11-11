import Button from "@/components/Button";
import { Profile } from "@/types/user";
import Image from "next/image";

type Props = {
  profile: Profile;
  userID: Profile["user_id"] | null;
};

function ProfileSummary({ profile, userID }: Props) {
  const {
    user_id: profileID,
    firstname,
    lastname,
    username,
    avatar,
    bio,
  } = profile;

  const isAuth = profileID === userID;

  return (
    <section className="py-4">
      <article className="wrapper flex flex-col gap-4 place-items-center">
        {avatar && (
          <figure className="">
            <Image
              src={avatar}
              alt={`${username}'s avatar'`}
              width="90"
              height="90"
              className="rounded-full object-cover size-24"
            />
          </figure>
        )}

        {!avatar && (
          <figure className="">
            <Image
              src={`https://avatar.iran.liara.run/username?username=${username}`}
              alt={`${username}'s avatar'`}
              width="90"
              height="90"
              className="rounded-full object-cover size-24 bg-gray-200  "
            />
          </figure>
        )}

        <div className="flex flex-col items-center">
          {firstname && (
            <h2 className="font-semibold text-lg ">
              {firstname} {lastname}
            </h2>
          )}

          <div className="flex flex-col items-center gap-1 text-sm text-center max-w-72">
            <div className="flex items-center gap-1 text-zinc-500 text-sm font-semibold">
              <p className=" ">@{username}</p>
              &#xb7;
              <p className="text-zinc-500 font-semibold">
                {username.length} following
              </p>
            </div>

            {bio && <p className="text-zinc-500 leading-5">{bio}</p>}
          </div>
        </div>

        <div className="mt-2">
          {isAuth && <Button className="gray">Edit Profile</Button>}
          {!isAuth && <Button className="gray">Follow</Button>}
        </div>
      </article>
    </section>
  );
}

export default ProfileSummary;
