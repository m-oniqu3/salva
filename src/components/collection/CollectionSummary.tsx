"use client";

import CollectionToolbar from "@/components/collection/CollectionToolbar";
import { SolidLockClosedIcon } from "@/components/icons";
import { useContextMenu } from "@/context/useContextMenu";
import type { CollectionSummary } from "@/types/collection";
import { ContextMenuEnum } from "@/types/context-menu";

type Props = { summary: CollectionSummary; userID: string | null };

function CollectionSummary({ summary, userID }: Props) {
  const {
    user: { user_id: collectionOwnerID },
    collection: { id, name, is_private: isPrivate, description, film_count },
  } = summary;

  const isCollectionOwner = userID === collectionOwnerID;
  const {
    state: { menu },
    openContextMenu,
    updateContextMenuPosition,
  } = useContextMenu();
  const isCOM = menu?.type === ContextMenuEnum.COM;

  return (
    <div className="">
      <section className="flex flex-col max-w-[450px] relative">
        <article className="flex flex-col gap-1">
          <h1 className="font-semibold text-base max-w-lg text-neutral-800 ">
            {name}
          </h1>

          {description && (
            <p className="text-neutral-600 text-[13px] leading-5">
              {description}
            </p>
          )}

          <div className="flex gap-2 font-semibold text-xs mt-1 text-neutral-800">
            {isPrivate && (
              <p className="flex gap-1 font-semibold">
                Private
                <SolidLockClosedIcon className="size-4" />
              </p>
            )}

            {isPrivate && <span>&#xb7;</span>}

            <p>
              {film_count}&nbsp;{film_count === 1 ? "film" : "films"}
            </p>
          </div>

          <CollectionToolbar
            isCollectionOwner={isCollectionOwner}
            summary={summary}
          />
        </article>
      </section>

      {/* {isCOM && (
        <Portal selector="body" close={closeContextMenu}>
          <CollectionOptionsMenu />
        </Portal>
      )} */}
    </div>
  );
}

export default CollectionSummary;
