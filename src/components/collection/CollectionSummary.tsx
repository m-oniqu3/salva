"use client";

import Avatar from "@/components/Avatar";
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
import Link from "next/link";

type Props = { summary: CollectionSummary; user: User | null };

function CollectionSummary({ summary, user }: Props) {
  const {
    user: { userID, username, avatar, firstname },
    collection: { name, is_private: locked, description },
  } = summary;

  const isOwner = userID === user?.id;

  const { dispatch } = useContextMenu();

  //todo: better function names for handlemore & handle add
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
        <h1 className="font-bold text-lg max-w-lg text-neutral-800">{name}</h1>

        {description && (
          <p className="text-zinc-500 text-[13px] leading-5">{description}</p>
        )}

        <div className="flex gap-2 font-semibold text-xs mt-1 text-neutral-800">
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

          {!isOwner && (
            <div className="flex gap-1">
              <span>&#xb7;</span>

              <button className="cursor-pointer">Follow</button>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-4">
          <div className="flex gap-3 items-center">
            <Avatar
              avatar={avatar}
              username={username}
              className={"size-8 rounded-full"}
            />

            {!isOwner && (
              <figcaption className="text-sml">
                By
                <span>&nbsp;</span>
                <Link href={`/${username}`} className="font-bold">
                  {firstname || username}
                </Link>
              </figcaption>
            )}
          </div>

          {isOwner && (
            <div className="flex gap-3">
              <div className="gray size-8 flex items-center justify-center rounded-full">
                <UserAddIcon className="size-3 text-neutral-800/60" />
              </div>

              <button className="rounded-full size-8 flex justify-center items-center gray cursor-pointer">
                <SolidSparkleIcon className="size-3 text-neutral-800/60" />
              </button>

              <button
                onClick={handleAdd}
                className="rounded-full size-8 flex justify-center items-center gray cursor-pointer"
                name="Collection Actions Menu"
              >
                <AddIcon className="size-3 text-neutral-800/60" />
              </button>

              <button
                onClick={handleMore}
                className="rounded-full size-8 flex justify-center items-center gray cursor-pointer"
              >
                <MoreHorizontalIcon className="size-3 text-neutral-800/60" />
              </button>
            </div>
          )}
        </div>
      </article>
    </section>
  );
}

export default CollectionSummary;
