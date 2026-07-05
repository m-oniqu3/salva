"use client";

import CollectionToolbar from "@/components/collection/CollectionToolbar";
import { SolidLockClosedIcon } from "@/components/icons";
import type { CollectionSummary } from "@/types/collection";
import { formatTimeAgo } from "@utils/validation/format-date";

type Props = { summary: CollectionSummary; userID: string | null };

function CollectionSummary({ summary, userID }: Props) {
  const {
    user: { user_id: collectionOwnerID },
    collection: {
      name,
      is_private: isPrivate,
      description,
      film_count,
      created_at,
    },
  } = summary;

  const isCollectionOwner = userID === collectionOwnerID;

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

            <span>&#xb7;</span>
            <p>{formatTimeAgo(created_at)}</p>
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
