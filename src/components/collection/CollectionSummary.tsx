"use client";

import Avatar from "@/components/Avatar";
import {
  AddIcon,
  MoreHorizontalIcon,
  PrivateIcon,
  SolidSparkleIcon,
  UserAddIcon,
} from "@/components/icons";
import { useContextMenu } from "@/context/useContextMenu";
import type { CollectionSummary } from "@/types/collection";
import { ContextMenuEnum } from "@/types/context-menu";
import Link from "next/link";
import { MouseEvent, useRef } from "react";

type Props = { summary: CollectionSummary; userID: string | null };

function CollectionSummary({ summary, userID }: Props) {
  const {
    user: { user_id: collectionOwnerID, username, avatar, firstname },
    collection: { name, is_private: isPrivate, description },
  } = summary;

  const isCollectionOwner = userID === collectionOwnerID;

  const { openContextMenu } = useContextMenu();
  const optionsRef = useRef<HTMLButtonElement | null>(null);

  //todo: better function names for handlemore & handle add
  function handleMoreOptions(e: MouseEvent) {
    const btn = optionsRef?.current?.getBoundingClientRect();

    if (!btn) return;

    console.log(e.pageX, e.pageY, btn, window.scrollX, window.scrollX);
    openContextMenu({
      type: ContextMenuEnum.COM,
      position: {
        x: btn.left - 50,
        y: btn.top + 60,
      },
    });
  }

  function handleAdd() {
    openContextMenu({
      type: ContextMenuEnum.AEM,
      position: { x: 500, y: 15 },
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
          {isPrivate && (
            <p className="flex gap-1 font-semibold">
              Private
              <span>
                <PrivateIcon className="size-4" />
              </span>
            </p>
          )}

          {isPrivate && <span>&#xb7;</span>}

          <p className="">{description?.length ?? 0} films</p>

          <span>&#xb7;</span>

          <p className="font-semibold flex gap-1">
            <span>{description?.length ? description?.length - 12 : 8}</span>
            <span>{description?.length === 1 ? "Follower" : "Followers"}</span>
          </p>

          {!isCollectionOwner && (
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
              className={"size-9 rounded-full"}
            />

            {!isCollectionOwner && (
              <figcaption className="text-sml">
                By
                <span>&nbsp;</span>
                <Link href={`/${username}`} className="font-bold">
                  {firstname || username}
                </Link>
              </figcaption>
            )}
          </div>

          {isCollectionOwner && (
            <div className="flex gap-3">
              <div className="gray size-9 flex items-center justify-center rounded-full">
                <UserAddIcon className="size-3.5 text-neutral-800/60" />
              </div>

              <button className="rounded-full size-9 flex justify-center items-center gray cursor-pointer">
                <SolidSparkleIcon className="size-3.5 text-neutral-800/60" />
              </button>

              <button
                onClick={handleAdd}
                className="rounded-full size-9 flex justify-center items-center gray cursor-pointer"
              >
                <AddIcon className="size-3.5 text-neutral-800/60" />
              </button>

              <button
                ref={optionsRef}
                onClick={handleMoreOptions}
                className="rounded-full size-9 flex justify-center items-center gray cursor-pointer"
              >
                <MoreHorizontalIcon className="size-3.5 text-neutral-800/60" />
              </button>
            </div>
          )}
        </div>
      </article>
    </section>
  );
}

export default CollectionSummary;
