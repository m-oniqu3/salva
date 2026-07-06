"use client";

import { LoadingIcon } from "@/components/icons";
import React, { useEffect, useRef } from "react";

type Props = {
  isLoadingIntialData: boolean;
  isLoadingMoreData: boolean;
  fetchMoreData: () => void;
  children: React.ReactNode;
};

function InfiniteScroll(props: Props) {
  const observerElement = useRef<HTMLDivElement | null>(null);
  const { isLoadingIntialData, isLoadingMoreData, fetchMoreData, children } =
    props;

  useEffect(() => {
    const node = observerElement.current;
    if (!node) return;

    // is element in view?
    function handleIntersection(entries: IntersectionObserverEntry[]) {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          !isLoadingMoreData &&
          !isLoadingIntialData
        ) {
          fetchMoreData();
        }
      });
    }

    // create observer instance
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "400px",
      threshold: 0,
    });

    observer.observe(node);

    // cleanup function
    return () => observer.disconnect();
  }, [fetchMoreData, isLoadingIntialData, isLoadingMoreData]);

  return (
    <>
      <>{children}</>

      <div
        ref={observerElement}
        className="flex justify-center items-center h-10"
      >
        {isLoadingMoreData && <LoadingIcon className="size-5 animate-spin" />}
      </div>
    </>
  );
}

export default InfiniteScroll;

/**
 *   const loadMoreRef = useRef<HTMLDivElement>(null);
 
   useEffect(() => {
     const node = loadMoreRef.current;
     if (!node) return;
 
     const observer = new IntersectionObserver(
       (entries) => {
         if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
           fetchNextPage();
         }
       },
       { rootMargin: "400px" },
     );
 
     observer.observe(node);
     return () => observer.disconnect();
   }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
 */
