"use client";

import Button from "@/components/Button";
import ErrorState from "@/components/ErrorState";
import {
  ArrowTurnUpRightIcon,
  CheckIcon,
  CopyIcon,
  DeleteIcon,
  LoadingIcon,
} from "@/components/icons";
import InfiniteScroll from "@/components/InfiniteScroll";
import { useModal } from "@/context/useModal";
import useGetFilms from "@/hooks/useGetFilms";
import { CollectionSummary } from "@/types/collection";
import { ModalEnum } from "@/types/modal";
import { getTMDBImageURL } from "@utils/get-cover-url";
import Image from "next/image";
import { useState } from "react";

type Props = {
  collection: CollectionSummary;
};

function OrganizeCollection(props: Props) {
  const { collection } = props;

  const { openModal } = useModal();

  const {
    isLoading,
    data,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useGetFilms({
    userID: collection.user.user_id,
    collectionID: collection.collection.id,
  });

  const [selectedIDs, setSelectedIDs] = useState<Set<number>>(new Set());

  if (isLoading) {
    return (
      <div className="flex-center w-full">
        <LoadingIcon className="size-5 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        heading="Reel Jammed"
        message="We couldn’t load your saved films. Try again in a moment."
        buttonLabel="Try Again"
        onClick={refetch}
        className="error-state-wrapper"
      />
    );
  }

  if (!data) {
    return (
      <ErrorState
        heading="Lost in the Archives"
        message="This collection doesn’t exist or may have been removed."
        className="error-state-wrapper"
      />
    );
  }

  function handleSelectedFilm(id: number) {
    setSelectedIDs((prev) => {
      const copy = new Set(prev);

      if (copy.has(id)) {
        copy.delete(id);
      } else {
        copy.add(id);
      }

      return copy;
    });
  }

  //  on delete use id
  // on move and copy use film id

  function selectAllFilms() {
    if (!data) return;

    const filmIDs = data?.map((film) => film.id) ?? [];
    setSelectedIDs(new Set(filmIDs));
  }

  function clearSelection() {
    setSelectedIDs(new Set());
  }

  function deleteFilms() {
    if (!selectedIDs) return;

    openModal({
      type: ModalEnum.MDF,
      payload: {
        selectedFilmIDs: Array.from(selectedIDs),
        collectionID: collection.collection.id,
        clearSelection,
      },
    });
  }

  function moveFilms() {
    if (!selectedIDs || !data) return;

    const filmIDs = data.reduce((acc, cur) => {
      if (selectedIDs.has(cur.id)) {
        acc.push(cur.filmID);
      }

      return acc;
    }, [] as number[]);

    openModal({
      type: ModalEnum.TRANSFER_FILMS,
      payload: {
        type: "move",
        selectedIDs: Array.from(selectedIDs),
        selectedFilmIDs: filmIDs,
        sourceCollectionID: collection.collection.id,
        clearSelection,
      },
    });
  }

  function copyFilms() {
    if (!selectedIDs || !data) return;

    const filmIDs = data.reduce((acc, cur) => {
      if (selectedIDs.has(cur.id)) {
        acc.push(cur.filmID);
      }

      return acc;
    }, [] as number[]);

    openModal({
      type: ModalEnum.TRANSFER_FILMS,
      payload: {
        type: "copy",
        selectedFilmIDs: filmIDs,
        sourceCollectionID: collection.collection.id,
        clearSelection,
      },
    });
  }

  const collection_actions = [
    { icon: CopyIcon, name: "copy", handler: copyFilms },
    { icon: ArrowTurnUpRightIcon, name: "move", handler: moveFilms },
    { icon: DeleteIcon, name: "delete", handler: deleteFilms },
  ];

  return (
    <div className="flex flex-col gap-8 relative">
      <header>
        <h1 className="text-base font-bold text-neutral-800">
          Organize your films
        </h1>
        <p className="">Select films to start</p>

        {selectedIDs && (
          <p className="text-sml mt-2">
            <strong>{selectedIDs.size}</strong> films selected
          </p>
        )}
      </header>

      <div className="flex flex-wrap items-center justify-between bg-white sticky top-28 left-0 w-full z-10">
        <div className="flex items-center  gap-3 py-4 ">
          {collection_actions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                disabled={!selectedIDs.size}
                key={action.name}
                onClick={action.handler}
                className="rounded-full size-9.5 flex justify-center items-center gray cursor-pointer transition-colors duration-200 ease-in-out hover:bg-gray-200 disabled:opacity-70"
              >
                <Icon className="size-4 text-neutral-800/60" />
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          {data.length !== selectedIDs.size && (
            <Button
              disabled={!data.length || data.length === selectedIDs.size}
              onClick={selectAllFilms}
              className="bg-neutral-800 text-white disabled:opacity-70"
            >
              Select All
            </Button>
          )}

          {selectedIDs.size > 0 && (
            <Button
              onClick={clearSelection}
              disabled={!data.length}
              className="gray text-neutral-800  disabled:opacity-70"
            >
              Deselect All
            </Button>
          )}
        </div>
      </div>

      <section>
        <InfiniteScroll
          isLoadingIntialData={isLoading}
          isLoadingMoreData={isFetchingNextPage}
          fetchMoreData={() => hasNextPage && fetchNextPage()}
        >
          <div className="content-grid">
            {data?.map((film) => {
              const posterURL = getTMDBImageURL(film.poster_path);

              const isSelected = selectedIDs.has(film.id);

              return (
                <figure
                  key={film.id}
                  onClick={() => handleSelectedFilm(film.id)}
                  className="relative"
                >
                  {isSelected && (
                    <div className="absolute z-5 absolute-center bg-white text-neutral-800 rounded-full size-12 grid place-items-center">
                      <CheckIcon className={`size-5 text-neutral-800`} />
                    </div>
                  )}

                  <Image
                    alt={film.title}
                    src={posterURL}
                    width={90}
                    height={90}
                    className={`cursor-pointer object-cover w-full h-full ${isSelected ? " border-neutral-800 opacity-50" : ""}`}
                  />
                </figure>
              );
            })}
          </div>
        </InfiniteScroll>
      </section>
    </div>
  );
}

export default OrganizeCollection;
