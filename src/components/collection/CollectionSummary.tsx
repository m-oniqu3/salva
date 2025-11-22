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
import Image from "next/image";

type Props = { summary: CollectionSummary };

function CollectionSummary({ summary }: Props) {
  const {
    user: { username, avatar },
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
    <section className="flex flex-col justify-center items-center text-center">
      <article className="flex flex-col justify-center ">
        <h1 className="font-bold text-lg max-w-lg">{name}</h1>

        {description && (
          <p className="text-zinc-500 leading-5 max-w-[450px] text-center mx-auto">
            {description}
          </p>
        )}

        <div className="flex justify-center items-center gap-1 font-semibold text-zinc-500 text-sml mt-2">
          {locked ? (
            <p className="flex justify-center gap-1 items-center font-semibold">
              Private
              <span>
                <PrivateIcon className="size-4" />
              </span>
            </p>
          ) : (
            <p className="font-semibold flex gap-1">
              <span>{description?.length ? description?.length - 12 : 8}</span>
              <span>
                {description?.length === 1 ? "Follower" : "Followers"}
              </span>
            </p>
          )}
          &#xb7;
          <p className="font-semibold">{description?.length ?? 0} films</p>
        </div>

        <div className="flex justify-center mt-4 relative left-2">
          <figure className="">
            {avatar && (
              <Image
                src={avatar}
                alt={`${username}'s avatar'`}
                width="90"
                height="90"
                className="rounded-full object-cover size-9 gray"
              />
            )}

            {!avatar && (
              <Image
                src={`https://avatar.iran.liara.run/username?username=${username}`}
                alt={`${username}'s avatar'`}
                width="90"
                height="90"
                className="rounded-full object-cover size-9 gray"
              />
            )}
          </figure>

          <div className="gray size-9 flex items-center justify-center rounded-full relative -left-3">
            <UserAddIcon className="size-4 text-zinc-500" />
          </div>
        </div>
      </article>

      <div className="flex justify-center gap-2 mt-7">
        <button className="rounded-full size-10 flex justify-center items-center gray cursor-pointer">
          <SolidSparkleIcon className="size-4 text-zinc-500 " />
        </button>

        <button
          onClick={handleAdd}
          className="rounded-full size-10 flex justify-center items-center gray cursor-pointer"
          name="Collection Actions Menu"
        >
          <AddIcon className="size-4 text-zinc-500 " />
        </button>

        <button
          onClick={handleMore}
          className="rounded-full size-10 flex justify-center items-center gray cursor-pointer"
        >
          <MoreHorizontalIcon className="size-4 text-zinc-500 " />
        </button>
      </div>
    </section>
  );
}

export default CollectionSummary;
