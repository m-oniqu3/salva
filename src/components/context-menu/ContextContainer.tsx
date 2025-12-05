import { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties | undefined;
};

function ContextContainer(props: Props) {
  const { children, className = "", style } = props;

  return (
    <div
      className={`gray p-2 rounded-xl ${className}`}
      style={style}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

export default ContextContainer;
