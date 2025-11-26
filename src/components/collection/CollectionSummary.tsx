"use client";

import {
  AddIcon,
  MoreHorizontalIcon,
  PrivateIcon,
  SolidSparkleIcon,
  UserAddIcon,
} from "@/components/icons";
import { ContextMenuActionEnum } from "@/context/actions/ContextMenuActions";
import { useContextMenu } from "@/context/useContextMenu";
import type { CollectionSummary } from "@/types/collection";
import { ContextMenuEnum } from "@/types/context-menu";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";

type Props = { summary: CollectionSummary; user: User | null };

function CollectionSummary({ summary, user }: Props) {
  const {
    user: { username, avatar, firstname },
    collection: { name, is_private: locked, description },
  } = summary;

  const { dispatch } = useContextMenu();

  function handleMore() {
    dispatch({
      type: ContextMenuActionEnum.OPEN_CONTEXT_MENU,
      payload: {
        currentContextMenu: ContextMenuEnum.COLLECTION_ACTIONS_MENU,
        position: { x: 500, y: 15 },
      },
    });
  }

  function handleAdd() {
    dispatch({
      type: ContextMenuActionEnum.OPEN_CONTEXT_MENU,
      payload: {
        currentContextMenu: ContextMenuEnum.ADD_ELEMENT_MENU,
        position: { x: 500, y: 15 },
      },
    });
  }

  return (
    <section className="flex flex-col max-w-[450px]">
      <article className="flex flex-col gap-1">
        <h1 className="font-bold text-lg max-w-lg">{name}</h1>

        {description && (
          <p className="text-zinc-500 text-sml leading-5">{description}</p>
        )}

        <div className="flex gap-2 font-semibold text-zinc-500 text-xs mt-1">
          {locked && (
            <p className="flex gap-1 font-semibold">
              Private
              <span>
                <PrivateIcon className="size-4" />
              </span>
            </p>
          )}

          {locked && <span>&#xb7;</span>}

          <p className="">{description?.length ?? 0} films</p>

          <span>&#xb7;</span>

          <p className="font-semibold flex gap-1">
            <span>{description?.length ? description?.length - 12 : 8}</span>
            <span>{description?.length === 1 ? "Follower" : "Followers"}</span>
          </p>

          {!user && <span>&#xb7;</span>}

          {!user && <button className="cursor-pointer">Follow</button>}
        </div>

        <div className="flex gap-3 mt-4">
          <figure className="flex gap-3 items-center">
            {avatar && (
              <Image
                src={avatar}
                alt={`${username}'s avatar'`}
                width="90"
                height="90"
                className="rounded-full object-cover size-8 gray"
              />
            )}

            {!avatar && (
              <Image
                src={`https://avatar.iran.liara.run/username?username=${username}`}
                alt={`${username}'s avatar'`}
                width="90"
                height="90"
                className="rounded-full object-cover size-8 gray"
              />
            )}

            {!user && (
              <figcaption>
                By
                <span>&nbsp;</span>
                <Link href={"#"} className="font-bold">
                  {firstname || username}
                </Link>
              </figcaption>
            )}
          </figure>

          {user && (
            <div className="flex gap-3">
              <div className="gray size-8 flex items-center justify-center rounded-full">
                <UserAddIcon className="size-3 text-zinc-500" />
              </div>

              <button className="rounded-full size-8 flex justify-center items-center gray cursor-pointer">
                <SolidSparkleIcon className="size-3 text-zinc-500" />
              </button>

              <button
                onClick={handleAdd}
                className="rounded-full size-8 flex justify-center items-center gray cursor-pointer"
                name="Collection Actions Menu"
              >
                <AddIcon className="size-3 text-zinc-500" />
              </button>

              <button
                onClick={handleMore}
                className="rounded-full size-8 flex justify-center items-center gray cursor-pointer"
              >
                <MoreHorizontalIcon className="size-3 text-zinc-500" />
              </button>
            </div>
          )}
        </div>
      </article>
    </section>
  );
}

export default CollectionSummary;
