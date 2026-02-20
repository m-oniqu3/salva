import { useRecentlySavedFilmContext } from "@/context/RecentlySavedFilmContext";
import { useQuery } from "@tanstack/react-query";
import { getMostRecentCollection } from "@utils/api/collections/get-most-recent-collection";
import { slugify } from "@utils/validation/slug";
import Link from "next/link";
import { useEffect } from "react";

type Props = {
  filmID: number;
  username: string | null;
  className?: string;
};

function RecentCollection(props: Props) {
  const { filmID, username, className = "" } = props;

  const { collectionLastSavedTo, setCollectionLastSavedTo, savedFilms } =
    useRecentlySavedFilmContext();

  const { data, isLoading } = useQuery({
    queryKey: ["collection", "recent"],
    queryFn: async () => {
      const { data, error } = await getMostRecentCollection();

      if (error) throw error;
      return data;
    },
    enabled: collectionLastSavedTo === null,
  });

  useEffect(() => {
    if (data) {
      setCollectionLastSavedTo(data);
    }
  }, [data]);

  const isFilmSaved = !!savedFilms[filmID];

  const savedFilmCollection = (isFilmSaved && savedFilms[filmID]) ?? null;
  let content;

  const canLinkCollection = isFilmSaved && savedFilmCollection && username;

  if (isLoading) {
    content = "";
  } else {
    if (canLinkCollection) {
      const { collection, savedToCollectionCount } = savedFilmCollection;

      const collection_slug = slugify(collection);

      const link_text = `${collection} ${savedToCollectionCount > 1 ? `+ ${(savedToCollectionCount - 1).toString().padStart(2, "0")} ` : ""}`;

      content = (
        <Link
          href={`/${username}/${collection_slug}`}
          className="underline-offset-2 hover:underline"
        >
          {link_text}
        </Link>
      );
    } else {
      if (collectionLastSavedTo) {
        content = collectionLastSavedTo.name;
      } else content = "...";
    }
  }

  return (
    <>
      {/* <p className="sm:hidden font-semibold text-white line-clamp-1">...</p> */}
      <p
        className={`block font-semibold  overflow-hidden text-ellipsis whitespace-nowrap min-w-0 ${className}`}
      >
        {content}
      </p>
    </>
  );
}

export default RecentCollection;
