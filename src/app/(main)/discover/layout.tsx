import GenreFilter from "@/components/films/GenreFilter";
import React, { Suspense } from "react";

type Props = {
  children: React.ReactNode;
};

function layout({ children }: Props) {
  return (
    <div className="pages">
      <Suspense fallback={null}>
        <GenreFilter />
      </Suspense>

      <>{children}</>
    </div>
  );
}

export default layout;
