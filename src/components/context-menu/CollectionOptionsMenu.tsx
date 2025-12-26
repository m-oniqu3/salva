"use client";

import { useContextMenu } from "@/context/useContextMenu";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";

// const menuOptions = [
//   { key: "EDIT", label: "Edit Details" },
//   { key: "ORG", label: "Organize" },
//   { key: "MP", label: "Make Public" },
//   { key: "IC", label: "Invite Collaborators" },
//   { key: "DEL", label: "Delete", className: "text-red-600 hover:bg-red-100" },
// ];

type Props = {
  closeContextMenu: () => void;
};

enum Options {
  "EDIT" = "Edit Details",
  "ORG" = "Organize",
  "MP" = "Make Public",
  "IC" = "Invite Collaborators",
  "S" = "Share",
  "DEL" = "Delete",
}

const keys = Object.keys(Options) as Array<keyof typeof Options>;

function CollectionOptionsMenu(props: Props) {
  const { closeContextMenu } = props;
  const { openModal } = useModal();
  const {
    state: { menu },
  } = useContextMenu();

  if (!menu) return null;

  // Action functions
  function editCollectionDetails() {
    console.log("editing collection");
    closeContextMenu();
    openModal({ type: ModalEnum.ECM });
  }

  function organizeCollection() {
    console.log("Organizing collection...");
  }

  function makePublic() {
    console.log("Making collection public...");
  }

  function inviteCollaborators() {
    console.log("Inviting collaborators...");
  }

  function deleteCollection() {
    console.log("Deleting collection...");
  }

  // lookup map
  const Actions: Record<string, () => void> = {
    EDIT: editCollectionDetails,
    ORG: organizeCollection,
    MP: makePublic,
    IC: inviteCollaborators,
    DEL: deleteCollection,
  };

  // handler
  function handleOptionsClick(key: string) {
    const action = Actions[key];

    if (!action) throw Error("No action exists for the given key.");

    action(); // safe call
  }

  const options = keys.map((key) => {
    return (
      <li
        key={key}
        onClick={handleOptionsClick.bind(null, key)}
        className={`p-3 font-semibold text-xs cursor-pointer hover:text-zinc-700 hover:rounded-lg hover:bg-[#ebebe9] transition-all ease-in-out duration-100 ${
          key === `DEL` ? `text-red-600` : `text-zinc-500`
        }`}
      >
        {Options[key]}
      </li>
    );
  });

  return (
    <div className="context-panel w-full">
      <ul className="w-44">{options}</ul>
    </div>
  );
}

export default CollectionOptionsMenu;
