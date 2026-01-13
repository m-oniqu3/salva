import Avatar from "@/components/Avatar";
import { type ProfileSnippet } from "@/types/user";
import Link from "next/link";

type Props = {
  profile: ProfileSnippet;
};

function ProfileSnippet(props: Props) {
  const {
    profile: { username, firstname, lastname, avatar },
  } = props;

  return (
    <Link href={"/" + username} className=" ">
      <figure className="grid grid-cols-[auto_1fr] items-center gap-4 p-4 rounded-2xl hover:gray">
        <Avatar
          avatar={avatar}
          username={username}
          className={"size-12 text-xl"}
        />

        <figcaption className="">
          {firstname && (
            <h2 className=" text-neutral-800 font-medium capitalize line-clamp-1">{`${firstname} ${lastname}`}</h2>
          )}
          <p className="text-sml font-medium text-zinc-500 line-clamp-1">
            @{username}
          </p>
        </figcaption>
      </figure>
    </Link>
  );
}

export default ProfileSnippet;
