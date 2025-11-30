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
  const { avatar, username, className = "", image, fallback } = props;

  return (
    <Link
      href={`/${username}`}
      className={`relative overflow-hidden ${className}`}
    >
      {avatar && (
        <figure className={`size-full ${image?.className || ""}`}>
          <Image
            src={avatar}
            alt={`${username}'s avatar'`}
            width="90"
            height="90"
            className="object-cover"
          />
        </figure>
      )}

      {!avatar && (
        <div
          className={`size-full flex items-center justify-center uppercase ${
            fallback?.className || ""
          }`}
        >
          {username.slice(0, fallback?.chars || 1)}
        </div>
      )}
    </Link>
  );
}

export default Avatar;
