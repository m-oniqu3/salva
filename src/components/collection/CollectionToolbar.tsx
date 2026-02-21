"use client";

import Avatar from "@/components/Avatar";
import {
  EditIcon,
  LockClosedIcon,
  LockOpenIcon,
  MoreHorizontalIcon,
  OrganizeIcon,
  SortIcon,
} from "@/components/icons";
import { useModal } from "@/context/useModal";
import { CollectionSummary } from "@/types/collection";
import { ModalEnum } from "@/types/modal";
import toggleCollectionPrivacy from "@utils/api/collections/toggle-collection-privacy";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  isCollectionOwner: boolean;
  summary: CollectionSummary;
};

function CollectionToolbar(props: Props) {
  const { isCollectionOwner, summary } = props;

  const { openModal } = useModal();
  const router = useRouter();

  const isCollectionPrivate = summary.collection.is_private;

  // disable button when loading
  async function togglePrivacyStatus() {
    console.log("Making collection public...");

    const { data, error } = await toggleCollectionPrivacy(
      summary.collection.id,
    );

    if (!error) {
      console.log(data);
      console.log("successfully toggled privacy");
    }
  }

  function handleEditModal() {
    const { id, name, description, cover_image, cover_type } =
      summary.collection;
    const { user_id } = summary.user;

    openModal({
      type: ModalEnum.ECM,
      payload: {
        collectionDetails: {
          id,
          name,
          description,
          cover_image,
          cover_type,
          collection_owner_id: user_id,
        },
      },
    });
  }

  function organizeCollection() {
    if (!isCollectionOwner) return;

    router.push(
      `/${summary.user.username}/${summary.collection.slug}/organize`,
    );
  }

  const toolbar = [
    { name: "Edit", icon: EditIcon, fn: handleEditModal },
    {
      name: "Privacy",
      icon: isCollectionPrivate ? LockOpenIcon : LockClosedIcon,
      fn: togglePrivacyStatus,
    },
    { name: "Organize", icon: OrganizeIcon, fn: organizeCollection },
    { name: "Sort", icon: SortIcon, fn: () => {} },
    { name: "More", icon: MoreHorizontalIcon, fn: () => {} },
  ];

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      <div className="flex gap-3 items-center">
        <Avatar
          avatar={summary.user.avatar}
          username={summary.user.username}
          className={"size-9.5 rounded-full"}
        />

        {!isCollectionOwner && (
          <figcaption className="text-sml">
            By &nbsp;
            <Link href={`/${summary.user.username}`} className="font-bold">
              {summary.user.firstname || summary.user.username}
            </Link>
          </figcaption>
        )}
      </div>

      {isCollectionOwner && (
        <>
          {toolbar.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.name}
                className="rounded-full size-9.5 flex justify-center items-center gray cursor-pointer transition-colors duration-200 ease-in-out hover:bg-gray-200"
                onClick={tool.fn}
              >
                <Icon className="size-4 text-neutral-800/60" />
              </button>
            );
          })}
        </>
      )}
    </div>
  );
}

export default CollectionToolbar;
