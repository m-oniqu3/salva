import { IconProps } from "@/components/icons";
import { JSX } from "react";

type Props = {
  tool: {
    name: string;
    handler: () => void;
    icon: ({ className }: IconProps) => JSX.Element;
    disabled?: boolean;
  };
};

function Tool(props: Props) {
  const { tool } = props;

  const Icon = tool.icon;

  return (
    <button
      key={tool.name}
      className="rounded-full size-9 flex justify-center items-center gray cursor-pointer transition-colors duration-200 ease-in-out hover:bg-neutral-200"
      disabled={tool.disabled}
      onClick={tool.handler}
    >
      <Icon className="size-3.5 text-neutral-800/60" />
    </button>
  );
}

export default Tool;
