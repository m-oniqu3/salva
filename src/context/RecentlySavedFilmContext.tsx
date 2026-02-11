"use client";

import { createContext, useContext, useState } from "react";

type SavedFilms = Record<
  number,
  {
    collection: string;
    collectionAmt: number;
  }
>;

type Data = {
  filmID: number;
  collection: string;
  collectionAmt: number;
};

type RecentlySavedFilmContextType = {
  savedFilms: SavedFilms;
  setRecentlySavedFilm: (data: Data) => void;
  removeRecentlySavedFilm: (id: number) => void;
};

const RecentlySavedFilmContext =
  createContext<RecentlySavedFilmContextType | null>(null);

export function RecentlySavedFilmProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [savedFilms, setSavedFilms] = useState<SavedFilms>({});

  function addFilm(data: Data) {
    const { filmID, collection, collectionAmt } = data;

    setSavedFilms((prev) => ({
      ...prev,
      [filmID]: { collection, collectionAmt },
    }));
  }

  function removeFilm(id: number) {
    setSavedFilms((prev) => {
      const copy = { ...prev };
      delete copy[id];

      return copy;
    });
  }

  return (
    <RecentlySavedFilmContext.Provider
      value={{
        savedFilms,
        setRecentlySavedFilm: addFilm,
        removeRecentlySavedFilm: removeFilm,
      }}
    >
      {children}
    </RecentlySavedFilmContext.Provider>
  );
}

export function useRecentlySavedFilm() {
  const context = useContext(RecentlySavedFilmContext);
  if (!context) throw new Error("Missing RecentlySavedFilmProvider");

  return context;
}
