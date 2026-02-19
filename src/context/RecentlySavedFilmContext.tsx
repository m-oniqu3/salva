"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type SavedFilms = Record<
  number,
  { collection: string; savedToCollectionCount: number }
>;

type Data = {
  filmID: number;
  collection: string;
  savedToCollectionCount: number;
};

type RecentlySavedFilmContextType = {
  collectionLastSavedTo: { id: number; name: string } | null;
  setCollectionLastSavedTo: Dispatch<
    SetStateAction<{
      id: number;
      name: string;
    } | null>
  >;
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
  const [collectionLastSavedTo, setCollectionLastSavedTo] = useState<{
    id: number;
    name: string;
  } | null>(null);

  function addFilm(data: Data) {
    const { filmID, collection, savedToCollectionCount } = data;

    setSavedFilms((prev) => ({
      ...prev,
      [filmID]: { collection, savedToCollectionCount },
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
        collectionLastSavedTo,
        setCollectionLastSavedTo,
        savedFilms,
        setRecentlySavedFilm: addFilm,
        removeRecentlySavedFilm: removeFilm,
      }}
    >
      {children}
    </RecentlySavedFilmContext.Provider>
  );
}

export function useRecentlySavedFilmContext() {
  const context = useContext(RecentlySavedFilmContext);
  if (!context) throw new Error("Missing RecentlySavedFilmProvider");

  return context;
}
