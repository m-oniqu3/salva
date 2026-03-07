import Menu from "@/components/context-menu/Menu";
import { useContextMenu } from "@/context/useContextMenu";
import { ContextMenuEnum } from "@/types/context-menu";

function ProfileOptionsMenu() {
  const {
    closeMenu,
    state: { menu },
  } = useContextMenu();

  if (!menu) return null;
  if (menu.type !== ContextMenuEnum.PROFILE_OPTIONS) return null;

  if (!menu.payload?.summary) throw new Error("Missing props");

  function deleteProfile() {
    console.log("Deleting profile...");
  }

  const options = [
    { label: "Share", onClick: () => {} },
    {
      label: "Delete",
      className: "text-red-600 hover:bg-red-700/50 hover:text-white",
      onClick: deleteProfile,
    },
  ];

  return <Menu items={options} />;
}

export default ProfileOptionsMenu;
