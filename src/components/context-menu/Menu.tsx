import { useContextMenu } from "@/context/useContextMenu";

type Props = {
  items: Array<{ label: string; onClick: () => void; className?: string }>;
};

function Menu(props: Props) {
  const { items } = props;

  const { stopPropagation } = useContextMenu();

  return (
    <ul className="context-panel w-48" onClick={stopPropagation}>
      {items.map((item) => {
        return (
          <li
            key={item.label}
            onClick={item.onClick}
            className={`p-3 font-semibold text-xs cursor-pointer transition-all duration-100 hover:rounded-lg
${item.className ?? "hover:bg-[#ebebe9] hover:text-zinc-700"}`}
          >
            {item.label}
          </li>
        );
      })}
    </ul>
  );
}

export default Menu;
