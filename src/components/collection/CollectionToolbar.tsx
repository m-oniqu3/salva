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
import Tool from "@/components/Tool";
import { useModal } from "@/context/useModal";
import { CollectionSummary } from "@/types/collection";
import { ModalEnum } from "@/types/modal";
import toggleCollectionPrivacy from "@utils/api/collections/toggle-collection-privacy";
import { getAvatarURL } from "@utils/get-cover-url";
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
    { name: "Edit", icon: EditIcon, handler: handleEditModal },
    {
      name: "Privacy",
      icon: isCollectionPrivate ? LockOpenIcon : LockClosedIcon,
      handler: togglePrivacyStatus,
    },
    { name: "Organize", icon: OrganizeIcon, handler: organizeCollection },
    { name: "Sort", icon: SortIcon, handler: () => {} },
    { name: "More", icon: MoreHorizontalIcon, handler: () => {} },
  ];

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      <div className="flex gap-3 items-center">
        <Avatar
          avatar={summary.user.avatar ? getAvatarURL(summary.user.avatar) : ""}
          username={summary.user.username}
          name={summary.user.firstname || summary.user.username}
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
          {toolbar.map((tool) => (
            <Tool key={tool.name} tool={tool} />
          ))}
        </>
      )}
    </div>
  );
}

export default CollectionToolbar;
