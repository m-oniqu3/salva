import { useContextMenu } from "@/context/useContextMenu";
import { MenuOption } from "@/types/context-menu";

type Props = {
  heading?: string;
  items: Array<MenuOption>;
};

function Menu(props: Props) {
  const { heading, items } = props;

  const { stopPropagation } = useContextMenu();

  return (
    <ul className="context-panel w-48" onClick={stopPropagation}>
      {heading && (
        <li className="pl-3 text-xs text-neutral-400 font-semibold pb-2">
          {heading}
        </li>
      )}

      {items.map((item) => {
        return (
          <li
            key={item.label}
            onClick={item.onClick}
            className={`p-3 font-semibold text-xs cursor-pointer transition-all duration-100 hover:rounded-xl
${item.className ?? "text-neutral-500 hover:bg-[#ebebe9] hover:text-neutral-700"}`}
          >
            {item.label}
          </li>
        );
      })}
    </ul>
  );
}

export default Menu;
