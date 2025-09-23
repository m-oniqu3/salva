import { RefObject, useEffect } from "react";

type Props = {
  ref: RefObject<HTMLElement | null>;
  closeElement: () => void;
  selector: string;
};

const useDetectClick = (props: Props) => {
  const { ref, closeElement, selector } = props;

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event?.target)) {
        // Check if the click event target is inside the modal or its children
        const element = document.getElementById(selector); // Replace "modal" with the ID of your modal element
        if (!element || !element.contains(event?.target)) {
          closeElement();
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, closeElement, selector]);
};

export default useDetectClick;
