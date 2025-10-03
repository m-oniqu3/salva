"use client";

import { AddIcon, MoreHorizontalIcon } from "@/components/icons";
import { ContextMenuActionEnum } from "@/context/actions/ContextMenuActions";
import { useContextMenu } from "@/context/useContextMenu";
import { ContextMenuEnum } from "@/types/context-menu";

function HomePage() {
  const { dispatch: ctxDispatch } = useContextMenu();

  function handleMore() {
    ctxDispatch({
      type: ContextMenuActionEnum.OPEN_CONTEXT_MENU,
      payload: {
        currentContextMenu: ContextMenuEnum.EDIT_BOARD_MENU,
        position: { x: 500, y: 15 },
      },
    });
  }

  function handleAdd() {
    ctxDispatch({
      type: ContextMenuActionEnum.OPEN_CONTEXT_MENU,
      payload: {
        currentContextMenu: ContextMenuEnum.ADD_ELEMENT_MENU,
        position: { x: 500, y: 15 },
      },
    });
  }

  return (
    <div className="">
      <div className="flex justify-center gap-4 mt-10">
        <button
          onClick={handleAdd}
          className="rounded-full size-10 flex justify-center items-center bg-gray-200"
        >
          <AddIcon className="size-5" />
        </button>

        <button
          onClick={handleMore}
          className="rounded-full size-10 flex justify-center items-center bg-gray-200"
        >
          <MoreHorizontalIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}

export default HomePage;
