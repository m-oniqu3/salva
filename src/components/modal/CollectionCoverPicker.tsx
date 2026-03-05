"use client";

import Button from "@/components/Button";
import ErrorState from "@/components/ErrorState";
import {
  CheckIcon,
  ChevronLeftIcon,
  EditIcon,
  LoadingIcon,
} from "@/components/icons";
import InfiniteScroll from "@/components/InfiniteScroll";
import { useModal } from "@/context/useModal";
import useGetFilms from "@/hooks/useGetFilms";
import { CollectionCover } from "@/types/collection";
import { ModalEnum } from "@/types/modal";
import { useQueryClient } from "@tanstack/react-query";
import { editCollection } from "@utils/api/collections/edit-collection";
import { uploadCollectionImage } from "@utils/api/collections/upload-collection-image";
import { getTMDBImageURL } from "@utils/get-cover-url";
import { collectionImageSchema } from "@utils/validation/edit-collection";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

function CollectionCoverPicker() {
  const {
    openModal,
    closeModal,
    stopPropagation,
    state: { modal },
  } = useModal();

  // Is CollectionCoverPicker Modal ?
  const isIPM = modal?.type === ModalEnum.IPM;
  const collectionDetails = isIPM ? modal.payload?.collectionDetails : null;

  const {
    isLoading,
    data,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useGetFilms({
    userID: collectionDetails?.collection_owner_id ?? "",
    collectionID: collectionDetails?.id,
  });

  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);
  const triggerFileInput = () => hiddenFileInputRef.current?.click();
  const [selectedCover, setSelectedCover] = useState<
    File | { id: number; poster_path: string } | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  // function to handle file input changes
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    setImagePreview("");
    const file = event.target.files?.[0];

    if (!file) return;

    const result = collectionImageSchema.safeParse(file);

    if (!result.success) {
      setImageError(result.error.issues[0].message);
      return;
    }

    // Preview
    const url = URL.createObjectURL(file);
    setImagePreview(url);

    setSelectedCover(file);
  };

  function handleSelectedFilmCover(id: number, url: string) {
    setSelectedCover((prev) =>
      prev && "id" in prev && prev.id === id ? null : { id, poster_path: url },
    );
    setImagePreview("");
  }

  // close IPM & open ECM
  function handleBack() {
    if (!collectionDetails) return;

    openModal({
      type: ModalEnum.ECM,
      payload: { collectionDetails },
    });
  }

  const queryClient = useQueryClient();
  async function handleSubmit() {
    if (!collectionDetails || !selectedCover) return;

    setIsSubmitting(true);
    let cover_image = "";

    try {
      if (selectedCover instanceof File) {
        console.log("instance of file");
        const formData = new FormData();

        formData.append("cover_image", selectedCover);
        formData.append("collection_id", String(collectionDetails.id));

        const { data, error } = await uploadCollectionImage(formData);

        if (error) throw error;

        if (!data) return;

        cover_image = data;
      } else {
        cover_image = selectedCover.poster_path;
      }

      // edit details here

      const { data, error } = await editCollection({
        collection: {
          id: collectionDetails.id,
          cover_image,
          cover_type:
            selectedCover instanceof File
              ? "uploaded"
              : ("external" as CollectionCover),
        },
      });

      if (error) throw error;
      if (!data) throw new Error("Something went wrong");

      toast("Cover updated.");

      const { username } = data;

      queryClient.invalidateQueries({
        queryKey: ["collections", username],
      });

      closeModal();
    } catch (error) {
      console.log(error);
      toast.message("Failed to update collection cover image.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="panel w-76 h-110 p-0 max-w-sm relative grid grid-rows-[70px_1fr_64px]  "
      onClick={stopPropagation}
    >
      <header className="grid grid-cols-[30px_auto_30px] items-start p-4 gap-1 border-t border-gray-50 shadow-xs">
        <button
          onClick={handleBack}
          className="relative top-0.5 cursor-pointer"
        >
          <ChevronLeftIcon className="size-6" />
        </button>

        <div className="flex flex-col  justify-center items-center text-center w-full">
          <h1 className="text-base text-center font-semibold text-neutral-800">
            Update Collection Cover
          </h1>

          <div className="flex text-sml text-center justify-center ">
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
              ref={hiddenFileInputRef}
              hidden
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {imageError && <p className="input-error">{imageError}</p>}
        </div>
      </header>

      <div className="flex flex-col gap-4 p-4 overflow-scroll no-scrollbar">
        {selectedCover instanceof File && imagePreview && (
          <figure className="mx-auto relative">
            <div
              className="absolute absolute-center bg-white text-neutral-800 rounded-full size-8 grid place-items-center cursor-pointer z-10"
              onClick={triggerFileInput}
            >
              <EditIcon className="size-4" />
            </div>

            <Image
              alt={selectedCover.name}
              src={imagePreview}
              width={90}
              height={90}
              className="object-cover h-32 rounded-md opacity-70"
            />
          </figure>
        )}

        <div className="relative h-full">
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
                className="absolute-center h-full w-full"
              />
            ))}

          {data && (
            <InfiniteScroll
              isLoadingIntialData={isLoading}
              isLoadingMoreData={isFetchingNextPage}
              fetchMoreData={() => hasNextPage && fetchNextPage()}
            >
              <div className="grid grid-cols-3 gap-1 ">
                {data?.map((film) => {
                  const isSelectedCover =
                    selectedCover &&
                    "id" in selectedCover &&
                    selectedCover.id === film.id;

                  const posterURL = getTMDBImageURL(film.poster_path);
                  return (
                    <figure
                      key={film.id}
                      className={`"w-full cursor-pointer relative transition-opacity duration-200 ease-in ${isSelectedCover ? "opacity-70" : ""}`}
                      onClick={() =>
                        handleSelectedFilmCover(film.id, film.poster_path)
                      }
                    >
                      {isSelectedCover && (
                        <div className="absolute absolute-center bg-white text-neutral-800 rounded-full size-10 grid place-items-center">
                          <CheckIcon className={`size-5 text-neutral-800`} />
                        </div>
                      )}

                      <Image
                        alt={film.title}
                        src={posterURL}
                        width={90}
                        height={90}
                        className="object-cover w-full h-full rounded-md"
                      />
                    </figure>
                  );
                })}
              </div>
            </InfiniteScroll>
          )}
        </div>
      </div>

      <footer className="flex items-center justify-end gap-4 p-4 border-t border-gray-50 shadow-xs">
        <Button onClick={closeModal}>Cancel</Button>
        <Button
          disabled={!selectedCover || isSubmitting}
          onClick={handleSubmit}
          className="bg-neutral-800 text-white disabled:opacity-50"
        >
          {isSubmitting ? "Saving" : "Save"}
        </Button>
      </footer>
    </div>
  );
}

export default CollectionCoverPicker;
