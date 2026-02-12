import { MostRecentCollection } from "@/types/collection";
import { slugify } from "@utils/validation/slug";
import Link from "next/link";

type Props = {
  isLoadingRecentCollection: boolean;
  recentCollection?: MostRecentCollection | null;
  isFilmRecentlySaved: boolean;
  recentlySavedFilm: { collection: string; collectionAmt: number } | null;
  username: string | null;
};

function RecentCollection(props: Props) {
  const {
    isLoadingRecentCollection,
    recentCollection,
    isFilmRecentlySaved,
    recentlySavedFilm,
    username,
  } = props;

  let content;

  const canShowLinkVersion =
    isFilmRecentlySaved && recentlySavedFilm && username;

  if (!isLoadingRecentCollection) {
    if (canShowLinkVersion) {
      const { collection, collectionAmt: amount } = recentlySavedFilm;

      const collection_slug = slugify(collection);
      const link_text = `${collection} ${amount > 1 ? `+ ${(amount - 1).toString().padStart(2, "0")} ` : ""}`;

      content = (
        <Link
          href={`/${username}/${collection_slug}`}
          className="underline-offset-2 hover:underline"
        >
          {link_text}
        </Link>
      );
    } else {
      if (recentCollection) {
        content = recentCollection.name;
      } else content = "...";
    }
  } else {
    content = "";
  }

  return (
    <>
      <p className="sm:hidden font-semibold text-white line-clamp-1">...</p>
      <p className="hidden sm:block font-semibold text-white overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
        {content}
      </p>
    </>
  );
}

export default RecentCollection;
