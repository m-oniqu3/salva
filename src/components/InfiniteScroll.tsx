"use client";

import { LoadingIcon } from "@/components/icons";
import React, { useEffect, useRef } from "react";

type Props = {
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  children: React.ReactNode;
};

function InfiniteScroll(props: Props) {
  const {
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    children,
  } = props;

  const observerElement = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = observerElement.current;
    if (!node) return;

    function handleIntersection(entries: IntersectionObserverEntry[]) {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          !isLoading
        ) {
          fetchNextPage();
        }
      });
    }

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "400px",
      threshold: 0,
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading]);

  return (
    <>
      <>{children}</>

      <div
        ref={observerElement}
        className="flex justify-center items-center h-20"
      >
        {isFetchingNextPage && <LoadingIcon className="size-5 animate-spin" />}
      </div>
    </>
  );
}

export default InfiniteScroll;
