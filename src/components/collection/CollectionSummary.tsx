import {
  AddIcon,
  MoreHorizontalIcon,
  PrivateIcon,
  SparkleIcon,
  UserAddIcon,
} from "@/components/icons";
import type { CollectionSummary } from "@/types/collection";
import Image from "next/image";

type Props = { summary: CollectionSummary };

function CollectionSummary({ summary }: Props) {
  const {
    user: { username, avatar },
    collection: { name, is_private: locked },
  } = summary;

  return (
    <section className="flex flex-col justify-center items-center text-center">
      <article className="flex flex-col justify-center">
        <h1 className="text-2xl font-semibold">{name}</h1>

        <div className="flex justify-center items-center gap-2 font-semibold">
          {locked ? (
            <p className="flex justify-center gap-1 items-center text-sm ">
              Private
              <span>
                <PrivateIcon className="size-4" />
              </span>
            </p>
          ) : (
            <p className="text-sm ">01 Follower</p>
          )}
          <p className="text-sm">@{username}</p>
        </div>

        <div className="flex justify-center mt-2">
          <figure className="">
            {avatar && (
              <Image
                src={avatar}
                alt={`${username}'s avatar'`}
                width="90"
                height="90"
                className="rounded-full object-cover size-9"
              />
            )}

            {!avatar && (
              <Image
                src={`https://avatar.iran.liara.run/username?username=${username}`}
                alt={`${username}'s avatar'`}
                width="90"
                height="90"
                className="rounded-full object-cover size-9 bg-gray-200"
              />
            )}
          </figure>

          <div className="gray size-9 flex items-center justify-center rounded-full relative -left-3 ">
            <UserAddIcon className="size-4 " />
          </div>
        </div>
      </article>

      <div className="flex justify-center gap-4 mt-10">
        <button className="rounded-full size-10 flex justify-center items-center gray">
          <SparkleIcon className="size-5" />
        </button>

        <button className="rounded-full size-10 flex justify-center items-center gray">
          <AddIcon className="size-5" />
        </button>

        <button className="rounded-full size-10 flex justify-center items-center gray">
          <MoreHorizontalIcon className="size-5" />
        </button>
      </div>
    </section>
  );
}

export default CollectionSummary;
