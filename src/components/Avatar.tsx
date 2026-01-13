import Image from "next/image";
import Link from "next/link";
import { HTMLAttributes } from "react";

type Props<T> = {
  avatar: string | null;
  username: string;
  className?: HTMLAttributes<T> | string | null;
};

function Avatar<T>(props: Props<T>) {
  const { avatar, username, className = "" } = props;

  //username initials (characters)
  const chars = username.at(0);

  return (
    <Link
      href={`/${username}`}
      className={`flex items-center justify-center overflow-hidden ${className}`}
    >
      {avatar && (
        <Image
          src={avatar}
          alt={`${username}'s avatar'`}
          width="90"
          height="90"
          className="size-full object-cover rounded-full"
        />
      )}

      {!avatar && (
        <span
          className="size-full rounded-full flex items-center justify-center uppercase text-[#ffffff] bg-[#ff9a6e]"
          style={{ fontSize: "inherit" }}
        >
          {chars}
        </span>
      )}
    </Link>
  );
}

export default Avatar;

/**
 * <div
          className={`size-full flex items-center justify-center uppercase ${
            fallback?.className || ""
          }`}
        >
          {username.slice(0, fallback?.chars || 1)}
        </div>
 */
