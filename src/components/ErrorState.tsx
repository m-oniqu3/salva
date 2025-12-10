"use client";

import Button from "@/components/Button";
import Link from "next/link";

type Props = {
  title: string;
  message: string;
  link: string;
  label: string;
  onClick?: () => void;
  className?: string;
};

function ErrorState(props: Props) {
  const {
    title = "Something went wrong",
    message = "We couldn't load this content. Please try again.",
    link = "/",
    label = "Home",
    onClick = () => {},
  } = props;

  return (
    <article className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="text-sml">{message}</p>

      <Link href={link} className="mt-3">
        <Button onClick={onClick} className="bg-neutral-800 text-white">
          {label}
        </Button>
      </Link>
    </article>
  );
}

export default ErrorState;
