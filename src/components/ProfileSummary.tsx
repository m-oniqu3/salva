import Avatar from "@/components/Avatar";
import { Profile } from "@/types/user";

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

  const isOwner = profileID === userID;

  return (
    <section className="py-4 max-w-[450px]">
      <article className="flex flex-col gap-1">
        <Avatar
          avatar={avatar}
          username={username}
          className={"size-12 rounded-full text-xl"}
        />

        <div className="mt-4">
          <h2 className="font-semibold text-lg capitalize text-neutral-800">
            {firstname && (
              <span>
                {firstname} {lastname}
              </span>
            )}
            {!firstname && username && <span>{username}</span>}
          </h2>
        </div>

        {bio && <p className="text-zinc-500 leading-5 text-[13px]">{bio}</p>}

        <div className="flex gap-2 font-semibold text-neutral-800 text-xs">
          <p className="">@{username}</p>

          <span>&#xb7;</span>

          <p>{username.length}&nbsp;Following</p>

          {bio && <span>&#xb7;</span>}

          <p className="font-semibold flex gap-1">
            <span>{bio?.length ? bio?.length - 12 : 8}</span>
            <span>{bio?.length === 1 ? "Follower" : "Followers"}</span>
          </p>

          {!isOwner && <span>&#xb7;</span>}

          {!isOwner && <button className="cursor-pointer">Follow</button>}

          {isOwner && <span> &#xb7;</span>}

          {isOwner && <button className="cursor-pointer">Edit Profile</button>}
        </div>
      </article>
    </section>
  );
}

export default ProfileSummary;
