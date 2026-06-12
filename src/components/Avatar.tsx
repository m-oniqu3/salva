"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { HTMLAttributes } from "react";

type Props<T> = {
  avatar: string | null;
  name: string;
  username: string;
  className?: HTMLAttributes<T> | string | null;
};

function Avatar<T>(props: Props<T>) {
  const { avatar, username, name, className = "" } = props;

  const router = useRouter();
  function handleNavigation() {
    router.push("/" + username);
  }

  return (
    <button
      onClick={handleNavigation}
      className={`flex items-center justify-center overflow-hidden cursor-pointer ${className}`}
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
          {name.at(0)}
        </span>
      )}
    </button>
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
