"use client";

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
    // is element in view?
    function handleIntersection(entries: IntersectionObserverEntry[]) {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          (!isLoadingMoreData || !isLoadingIntialData)
        ) {
          fetchMoreData();
        }
      });
    }

    // create observer instance
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "100px",
      threshold: 0,
    });

    if (observerElement.current) {
      observer.observe(observerElement.current);
    }

    // cleanup function
    return () => observer.disconnect();
  }, [fetchMoreData, isLoadingIntialData, isLoadingMoreData]);

  return (
    <>
      <>{children}</>

      <div ref={observerElement} id="obs">
        {/* {isLoadingMoreData && !isLoadingIntialData && (
          <div className="flex justify-center items-center h-20">
            <LoadingIcon className="size-5" />
          </div>
        )} */}
      </div>
    </>
  );
}

export default InfiniteScroll;
