import FilmGenres from "@/components/discover/FilmGenres";
import TopCollections from "@/components/discover/TopCollections";
import React from "react";

type Props = {
  children: React.ReactNode;
};

function DiscoverLayout({ children }: Props) {
  return (
    <div className="pages">
      <FilmGenres />
      <TopCollections />

      {children}
    </div>
  );
}

export default DiscoverLayout;
