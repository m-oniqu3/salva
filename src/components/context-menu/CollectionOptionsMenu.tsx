"use client";

import { useContextMenu } from "@/context/useContextMenu";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";

type Props = {
  closeContextMenu: () => void;
};

function CollectionOptionsMenu(props: Props) {
  const { closeContextMenu } = props;
  const { openModal } = useModal();
  const {
    state: { menu },
  } = useContextMenu();

  if (!menu) return null;
  if (!menu.payload?.collectionSummary)
    throw new Error(
      "Collection Summary must be provided to" + CollectionOptionsMenu.name
    );

  const collectionSummary = menu.payload.collectionSummary;

  const CollectionOptions = {
    EDIT: "Edit Details",
    ORG: "Organize",
    MP: collectionSummary?.collection.is_private
      ? "Make Public"
      : "Make Private",
    IC: "Invite Collaborators",
    S: "Share",
    DEL: "Delete",
  } as const;

  const keys = Object.keys(CollectionOptions) as Array<
    keyof typeof CollectionOptions
  >;

  // Action functions
  function editCollectionDetails() {
    console.log("editing collection");
    closeContextMenu();
    openModal({ type: ModalEnum.ECM, payload: { collectionSummary } });
  }

  function organizeCollection() {
    console.log("Organizing collection...");
  }

  function togglePrivacyStatus() {
    console.log("Making collection public...");
  }

  function inviteCollaborators() {
    console.log("Inviting collaborators...");
  }

  function deleteCollection() {
    console.log("Deleting collection...");
  }

  function handleOptionsClick(key: keyof typeof CollectionOptions) {
    switch (key) {
      case "EDIT":
        return editCollectionDetails();

      case "ORG":
        return organizeCollection();

      case "MP":
        return togglePrivacyStatus();

      case "IC":
        return inviteCollaborators();

      case "DEL":
        return deleteCollection();

      default:
        throw new Error(`No action exists for key: ${key}`);
    }
  }

  const rendered_collection_options = keys.map((key) => {
    return (
      <li
        key={key}
        onClick={() => handleOptionsClick(key)}
        className={`p-3 font-semibold text-xs cursor-pointer text-zinc-500 hover:text-zinc-700 hover:rounded-lg hover:bg-[#ebebe9] transition-all ease-in-out duration-100 ${
          key === `DEL` ? `text-red-600` : ""
        }`}
      >
        {CollectionOptions[key]}
      </li>
    );
  });

  return (
    <div className="context-panel w-full" onClick={(e) => e.stopPropagation()}>
      <ul className="w-44">{rendered_collection_options}</ul>
    </div>
  );
}

export default CollectionOptionsMenu;
