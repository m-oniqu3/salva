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
      <article className="flex flex-col gap-2">
        <Avatar
          avatar={avatar}
          username={username}
          className={"gray rounded-2xl size-[70px]"}
          fallback={{
            className: "text-3xl font-semibold bg-neutral-700 text-neutral-100",
            chars: 2,
          }}
        />

        <div className="mt-2">
          {firstname && (
            <h2 className="font-bold text-xl capitalize text-neutral-700">
              {firstname} {lastname}
            </h2>
          )}

          {!firstname && username && (
            <h2 className="font-bold text-xl text-neutral-700">{username}</h2>
          )}
        </div>

        {bio && <p className="text-zinc-500 leading-5 text-[13px]">{bio}</p>}

        <div className="flex gap-2 font-semibold text-neutral-600 text-sml">
          <p className="">@{username}</p>

          <span>&#xb7;</span>

          <p>{username.length} Following</p>

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
