"use client";

import Button from "@/components/Button";
import Link from "next/link";

type Props = {
  title?: string;
  message?: string;
  link?: string; // if provided, renders a Link
  buttonLabel?: string;
  onClick?: () => void; // if provided, renders a Button with click handler
  className?: string;
};

export default function ErrorState(props: Props) {
  const {
    title = "Something went wrong",
    message = "We couldn't load this content. Please try again.",
    link,
    buttonLabel = "Home",
    onClick,
    className = "",
  } = props;

  return (
    <article
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 ${className}`}
    >
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="text-sml text-center">{message}</p>

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
  );
}
