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
      className={`px-3  rounded-md text-sm font-bold cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
