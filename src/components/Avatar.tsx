import Image from "next/image";
import Link from "next/link";
import { HTMLAttributes } from "react";

type Props<T> = {
  avatar: string | null;
  username: string;
  className: HTMLAttributes<T> | string | null;

  image?: {
    className?: HTMLAttributes<T> | string | null;
  };

  fallback?: {
    className?: HTMLAttributes<T> | string | null;
    chars?: 1 | 2;
    background?: string | null;
    color?: string | null;
  };
};

function Avatar<T>(props: Props<T>) {
  const { avatar, username, className } = props;

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
          className="object-cover"
        />
      )}

      {!avatar && (
        <span
          className="size-full grid place-items-center uppercase text-[#ffffff] bg-[#dec5da]"
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
