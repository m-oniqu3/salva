"use client";

import Button from "@/components/Button";
import Link from "next/link";

type Props = {
  heading: string;
  message: string;
  link?: string; // if provided, renders a Link
  buttonLabel?: string;
  onClick?: () => void; // if provided, renders a Button with click handler
  className?: string;
};

export default function ErrorState(props: Props) {
  const {
    heading,
    message,
    link,
    buttonLabel,
    onClick,
    className = "",
  } = props;

  return (
    <section className="grid place-items-center size-full">
      <article
        className={`size-full flex flex-col justify-center items-center text-center max-w-xs ${className}`}
      >
        <h1 className="text-md font-semibold">{heading}</h1>
        <p className="text-sml">{message}</p>

        {onClick ? (
          <Button className="mt-3 bg-neutral-800 text-white" onClick={onClick}>
            {buttonLabel}
          </Button>
        ) : link ? (
          <Link href={link} className="mt-3">
            <Button className="bg-neutral-800 text-white">{buttonLabel}</Button>
          </Link>
        ) : null}
      </article>
    </section>
  );
}
