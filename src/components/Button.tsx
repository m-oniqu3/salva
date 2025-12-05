import { ReactNode } from "react";

type Props = {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  children: ReactNode;
};

function Button(props: Props) {
  const { children, onClick, disabled, className, type = "button" } = props;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-[11px] h-[35px] rounded-full text-xs font-bold cursor-pointer grid place-items-center ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
