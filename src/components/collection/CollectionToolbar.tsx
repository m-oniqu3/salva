"use client";

import Avatar from "@/components/Avatar";
import CollectionOptionsMenu from "@/components/context-menu/CollectionOptionsMenu";
import {
  EditIcon,
  LockClosedIcon,
  LockOpenIcon,
  MoreHorizontalIcon,
  OrganizeIcon,
} from "@/components/icons";
import Tool from "@/components/Tool";
import { useContextMenu } from "@/context/useContextMenu";
import { useModal } from "@/context/useModal";
import { CollectionSummary } from "@/types/collection";
import { ContextMenuEnum } from "@/types/context-menu";
import { ModalEnum } from "@/types/modal";
import toggleCollectionPrivacy from "@utils/api/collections/toggle-collection-privacy";
import { getAvatarURL } from "@utils/get-cover-url";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  isCollectionOwner: boolean;
  summary: CollectionSummary;
};

function CollectionToolbar(props: Props) {
  const { isCollectionOwner, summary } = props;

  const { openModal } = useModal();
  const {
    openMenu,
    closeMenu,
    state: { menu },
  } = useContextMenu();
  const router = useRouter();

  const isCollectionOptionsMenu =
    menu?.type === ContextMenuEnum.COLLECTION_OPTIONS;
  const [isTogglingPrivacy, setIsTogglingPrivacy] = useState(false);

  async function togglePrivacyStatus() {
    toast.promise(
      async function () {
        setIsTogglingPrivacy(true);

        const { error } = await toggleCollectionPrivacy({
          collection: {
            id: summary.collection.id,
            isPrivate: summary.collection.is_private,
          },
        });

        if (error) throw error;
        setIsTogglingPrivacy(false);
      },
      {
        loading: "Updating collection's privacy...",
        success: () => {
          router.replace(
            `/${summary.user.username}/${summary.collection.slug}`,
          );
          return "Collection's privacy updated.";
        },
        error: "Failed to update collection\'s privacy.",
      },
    );
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

  function handleMore() {
    openMenu({
      type: ContextMenuEnum.COLLECTION_OPTIONS,
      payload: { summary },
    });
  }

  const toolbar = [
    { name: "Edit", icon: EditIcon, handler: handleEditModal },
    {
      name: "Privacy",
      icon: summary.collection.is_private ? LockOpenIcon : LockClosedIcon,
      handler: togglePrivacyStatus,
      disabled: isTogglingPrivacy,
    },
    { name: "Organize", icon: OrganizeIcon, handler: organizeCollection },
    { name: "More", icon: MoreHorizontalIcon, handler: handleMore },
  ];

  return (
    <div className=" flex flex-wrap gap-3 mt-4">
      <div className="relative flex flex-wrap gap-3 items-center">
        <Avatar
          avatar={summary.user.avatar ? getAvatarURL(summary.user.avatar) : ""}
          username={summary.user.username}
          name={summary.user.firstname || summary.user.username}
          className={"size-9 rounded-full"}
        />
        {!isCollectionOwner && (
          <figcaption className="text-sml">
            By &nbsp;
            <Link href={`/${summary.user.username}`} className="font-bold">
              {summary.user.firstname || summary.user.username}
            </Link>
          </figcaption>
        )}

        {isCollectionOwner && (
          <>
            {toolbar.map((tool) => (
              <Tool key={tool.name} tool={tool} />
            ))}

            {isCollectionOptionsMenu && (
              <div className="absolute top-15 right-0 z-5">
                {isCollectionOptionsMenu && <CollectionOptionsMenu />}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CollectionToolbar;
