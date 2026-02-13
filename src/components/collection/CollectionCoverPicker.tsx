"use client";

import ErrorState from "@/components/ErrorState";
import { ChevronLeftIcon, CloseIcon, LoadingIcon } from "@/components/icons";
import InfiniteScroll from "@/components/InfiniteScroll";
import { useModal } from "@/context/useModal";
import useGetFilms from "@/hooks/useGetFilms";
import { ModalEnum } from "@/types/modal";
import Image from "next/image";
import { useRef } from "react";

function CollectionCoverPicker() {
  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);
  const triggerFileInput = () => hiddenFileInputRef.current?.click();

  const {
    openModal,
    closeModal,
    stopPropagation,
    state: { modal },
  } = useModal();

  // Is CollectionCoverPicker Modal ?
  const isIPM = modal?.type === ModalEnum.IPM;
  const collectionSummary = isIPM ? modal.payload?.collectionSummary : null;

  const {
    isLoading,
    data,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useGetFilms({
    userID: collectionSummary?.user.user_id ?? "",
    collectionID: collectionSummary?.collection.id,
  });

  const rendered_images =
    data?.map((film) => {
      return (
        <figure key={film.id} className="w-full">
          <Image
            alt={film.title}
            src={film.poster_path}
            width={90}
            height={90}
            className="object-cover w-full"
          />
        </figure>
      );
    }) ?? null;

  //todo : get the collection images from the db for the given collection

  // close IPM & open ECM
  function handleBack() {
    if (!collectionSummary) return;

    openModal({
      type: ModalEnum.ECM,
      payload: { collectionSummary: collectionSummary },
    });
  }

  return (
    <div className="panel p-0 max-w-sm relative" onClick={stopPropagation}>
      <header className="sticky top-0 left-0 w-full bg-white p-4 border-b border-gray-50">
        <div className="grid grid-cols-[30px_auto_30px] place-items-center text-center items-start gap-1">
          <button
            onClick={handleBack}
            className="relative top-1 cursor-pointer"
          >
            <ChevronLeftIcon className="size-6" />
          </button>
          <div>
            <h1 className="text-lg text-center font-semibold text-neutral-800">
              Update Collection Cover
            </h1>

            <div className="flex text-sml text-center justify-center">
              <p>Select an image or</p>
              <span>&nbsp;</span>

              <button
                type="button"
                className="underline underline-offset-1 cursor-pointer"
                onClick={triggerFileInput}
              >
                upload
              </button>

              <input
                // {...register("image")}
                ref={hiddenFileInputRef}
                hidden
                type="file"
                // onChange={handleFileChange}
              />
            </div>
          </div>
          <button
            onClick={closeModal}
            className="relative top-1 cursor-pointer"
          >
            <CloseIcon className="size-4.5" />
          </button>
        </div>
      </header>

      <div className="p-8 ">
        {isLoading && (
          <div>
            <LoadingIcon className="size-5 animate-spin" />
          </div>
        )}

        {error && (
          <ErrorState
            heading="Reel Jammed"
            message="We couldn’t load your saved films. Try again in a moment."
            buttonLabel="Try Again"
            onClick={refetch}
          />
        )}

        {!data ||
          (data.length === 0 && (
            <ErrorState
              heading="Nothing in the Archives"
              message="Your saved films will appear here once you start collecting."
            />
          ))}

        {rendered_images && (
          <InfiniteScroll
            isLoadingIntialData={isLoading}
            isLoadingMoreData={isFetchingNextPage}
            fetchMoreData={() => hasNextPage && fetchNextPage()}
          >
            <div className="grid grid-cols-3 gap-4 ">{rendered_images}</div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}

export default CollectionCoverPicker;
