import { CSSProperties, ReactNode } from "react";

type Props = {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  children: ReactNode;
  style?: CSSProperties | undefined;
};

function Button(props: Props) {
  const {
    children,
    onClick,
    disabled,
    className,
    type = "button",
    style,
  } = props;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`p-3 h-9 rounded-full text-xs font-bold cursor-pointer flex items-center justify-center gap-1  ${className}`}
      style={style}
    >
      {children}
    </button>
  );
}

export default Button;
