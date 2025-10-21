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
      className={`px-4 h-10 rounded-full text-sml font-bold cursor-pointer flex items-center justify-center ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
