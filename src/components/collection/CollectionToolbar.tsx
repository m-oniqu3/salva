"use client";

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

type Props = {
  isCollectionPrivate: boolean;
  isCollectionOwner: boolean;
  summary: CollectionSummary;
  // user: { avatar: string | null; username: string; firstname: string };
};

function CollectionToolbar(props: Props) {
  const {
    isCollectionOwner,
    isCollectionPrivate,
    summary,
    // user: { avatar, username, firstname },
  } = props;

  const { openModal } = useModal();

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
    openModal({
      type: ModalEnum.ECM,
      payload: {
        collectionSummary: summary,
      },
    });
  }

  const toolbar = [
    {
      name: "Edit",
      icon: EditIcon,
      fn: handleEditModal,
    },
    {
      name: "Privacy",
      icon: isCollectionPrivate ? LockOpenIcon : LockClosedIcon,
      fn: togglePrivacyStatus,
    },
    {
      name: "Organize",
      icon: OrganizeIcon,
      fn: () => {},
    },

    {
      name: "Sort",
      icon: SortIcon,
      fn: () => {},
    },

    {
      name: "More",
      icon: MoreHorizontalIcon,
      fn: () => {},
    },
  ];

  const rendered_icons = toolbar.map((tool) => {
    const Icon = tool.icon;
    return (
      <button
        key={tool.name}
        className="rounded-full size-8.5 flex justify-center items-center gray cursor-pointer transition-colors duration-200 ease-in-out hover:bg-gray-200"
        onClick={tool.fn}
      >
        <Icon className="size-3.5 text-neutral-800/60" />
      </button>
    );
  });
  return <>{rendered_icons}</>;
}

export default CollectionToolbar;
