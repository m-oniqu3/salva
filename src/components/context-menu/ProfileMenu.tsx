"use client";

import Menu from "@/components/context-menu/Menu";
import { useContextMenu } from "@/context/useContextMenu";
import { ContextMenuEnum } from "@/types/context-menu";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "@utils/api/auth/logout";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function ProfileMenu() {
  const {
    state: { menu },
    closeMenu,
  } = useContextMenu();

  const router = useRouter();
  const queryClient = useQueryClient();

  if (!menu) return null;
  if (menu.type !== ContextMenuEnum.PROFILE_MENU) return null;

  const user = menu.payload!.user;

  function handleNavigate(route: string) {
    router.push("/" + route);
    closeMenu();
  }

  function handleLogout() {
    logout()
      .then(() => {
        router.replace("/");
        queryClient.clear();
      })
      .catch((error) => {
        toast("Failed to logout");
      });
  }

  const options = [
    { label: "Profile", onClick: handleNavigate.bind(null, user!.username) },
    { label: "Films", onClick: handleNavigate.bind(null, "films") },
    { label: "Logout", onClick: handleLogout },
  ];

  return <Menu items={options} />;
}

export default ProfileMenu;
