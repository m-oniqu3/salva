import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  children: React.ReactNode;
  selector: string;
  close: () => void;
};

export default function Portal({ children, selector, close }: Props) {
  const portalElement = useRef<HTMLElement | null>(null); // ref to reference an element
  const [mounted, setMounted] = useState(false); // has ref been populated?

  useEffect(() => {
    if (!portalElement.current) {
      const el = document.querySelector(selector) as HTMLElement;

      if (el) {
        portalElement.current = el;
        setMounted(true);
      }
    }
  }, [selector]);

  /**
   * useEffect(() => {
    function handleClick(e: Event) {
      const trgt = e.target;
      if (trgt && portalElement) {
        if (trgt !== portalElement.current) { // will need e.stopPropagation in the menu component.. write down why
          close();
        }
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [close]);
  */

  useEffect(() => {
    function handleClick(e: Event) {
      const trgt = e.target as Node;

      if (trgt && portalElement) {
        if (!portalElement.current?.contains(trgt)) {
          // with this approach you dont have to use e.stopPropagation()
          close();
        }
      }
    }

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, [close]);

  if (!mounted || !portalElement.current) return null;

  return createPortal(children, portalElement.current);
}
