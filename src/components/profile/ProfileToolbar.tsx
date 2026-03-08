"use client";

import ProfileOptionsMenu from "@/components/context-menu/ProfileOptionsMenu";
import SortCollectionPreviews from "@/components/context-menu/SortCollectionPreviews";
import {
  AddIcon,
  BookmarkIcon,
  EditIcon,
  MoreHorizontalIcon,
} from "@/components/icons";
import Tool from "@/components/Tool";
import { useContextMenu } from "@/context/useContextMenu";
import { useModal } from "@/context/useModal";
import { ContextMenuEnum } from "@/types/context-menu";
import { ModalEnum } from "@/types/modal";
import { ProfileSummary } from "@/types/user";
import { useRouter } from "next/navigation";

type Props = {
  profileSummary: ProfileSummary;
};

function ProfileToolbar(props: Props) {
  const { profileSummary } = props;

  const router = useRouter();
  const { openModal } = useModal();
  const {
    openMenu,
    closeMenu,
    state: { menu },
  } = useContextMenu();

  const isProfileOptionsMenu = menu?.type === ContextMenuEnum.PROFILE_OPTIONS;
  const isSortCollectionPreviewsMenu =
    menu?.type === ContextMenuEnum.SORT_COLLECTION_PREVIEWS;

  function handleEditModal() {
    closeMenu();
    openModal({
      type: ModalEnum.EDIT_PROFILE,
      payload: { profileSummary },
    });
  }

  function handleCreateCollection() {
    closeMenu();
    openModal({ type: ModalEnum.CREATE_COLLECTION });
  }

  function handleMore() {
    openMenu({
      type: ContextMenuEnum.PROFILE_OPTIONS,
      payload: { summary: profileSummary },
    });
  }

  function handleViewFilms() {
    router.push("/films");
  }

  const toolbar = [
    { name: "Films", icon: BookmarkIcon, handler: handleViewFilms },
    { name: "Create", icon: AddIcon, handler: handleCreateCollection },
    { name: "Edit", icon: EditIcon, handler: handleEditModal },
    { name: "More", icon: MoreHorizontalIcon, handler: handleMore },
  ];

  return (
    <div className="flex items-center flex-wrap gap-3 relative w-fit">
      {toolbar.map((tool) => (
        <Tool key={tool.name} tool={tool} />
      ))}

      {isSortCollectionPreviewsMenu && (
        <div className="absolute top-15 -right-10 z-5">
          <SortCollectionPreviews />
        </div>
      )}

      <div className="absolute top-15 right-0 z-5">
        {isProfileOptionsMenu && <ProfileOptionsMenu />}
      </div>
    </div>
  );
}

export default ProfileToolbar;
