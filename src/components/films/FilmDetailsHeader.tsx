import AuthButtons from "@/components/auth/AuthButtons";
import RecentCollection from "@/components/collection/RecentCollection";
import {
  AddIcon,
  CheckIcon,
  ChevronDownIcon,
  FilmOutlineIcon,
  ViewIcon,
} from "@/components/icons";
import { useRecentlySavedFilmContext } from "@/context/RecentlySavedFilmContext";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";
import { Credits, MediaType, Movie, TMDBFilm, TVShow } from "@/types/tmdb";
import { UserMeta } from "@/types/user";
import { useQueryClient } from "@tanstack/react-query";
import { addFilmToCollection } from "@utils/api/collections/add-film-to-collection";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  film: Movie | TVShow;
  media_type: MediaType;
  user: UserMeta;
  credits: Credits;
  recommendations?: TMDBFilm[];
  isIntersecting?: boolean;
  onScrollToSection?: () => void;
};

function FilmDetailsHeader(props: Props) {
  const { user, film, media_type, onScrollToSection, credits } = props;
  const title = "title" in film ? film.title : film.name;
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  function handleNavigate(href: string) {
    router.push("/" + href);
  }

  const links = {
    Home: handleNavigate.bind(null, "home"),
    Profile: handleNavigate.bind(null, user?.username ?? ""),
  };

  // Get recently saved films and check if the current film was recently saved
  const {
    collectionLastSavedTo,
    savedFilms,
    setRecentlySavedFilm,
    removeRecentlySavedFilm,
  } = useRecentlySavedFilmContext();
  const isFilmRecentlySaved = !!savedFilms[film.id];
  const queryClient = useQueryClient();

  const { openModal } = useModal();

  const filmMeta: TMDBFilm = {
    id: film.id,
    title: title,
    poster_path: film.poster_path ?? "",
    media_type,
  };

  function handleFilmCollectionModal() {
    openModal({
      type: ModalEnum.FCM,
      payload: { film: filmMeta, user },
    });
  }

  function handleFilmDetailsModal() {
    openModal({
      type: ModalEnum.FILM_DETAILS_MODAL,
      payload: { data: { film, media_type, user, credits } },
    });
  }

  const buttons = [
    // { name: "Film Details", handler: () => {}, className: "lg:hidden" },
    { name: "Similar", handler: onScrollToSection },
  ];

  async function handleSaveFilm() {
    if (!film) return;

    try {
      if (collectionLastSavedTo) {
        setIsLoading(true);

        setRecentlySavedFilm({
          filmID: film.id,
          collection: collectionLastSavedTo.name,
          savedToCollectionCount: 1,
        });

        const { error } = await addFilmToCollection({
          film: filmMeta,
          newIDs: [collectionLastSavedTo.id],
          deletedIDs: [],
        });

        if (error) throw error;

        toast(`Saved film to your collection.`);
        queryClient.invalidateQueries({
          queryKey: ["film", film.id, "collections"],
          refetchType: "all",
        });

        queryClient.invalidateQueries({
          queryKey: ["collections", user?.username ?? ""],
        });

        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      removeRecentlySavedFilm(film.id);
      toast("Failed to save film to your collection");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <header className="h-24 grid grid-cols-1 lg:grid-cols-2">
      <div className="flex wrapper items-center justify-between gap-4 pl-8 ">
        {user ? (
          <ul className=" flex items-center gap-4  ">
            {Object.entries(links).map(([link, handler]) => {
              const visible = user ? "order-2" : "hidden";
              return (
                <li
                  key={link}
                  onClick={handler}
                  className={`text-sml font-medium cursor-pointer text-neutral-800 text-sml ${visible}`}
                >
                  {link}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className=" flex items-center w-fit lg:invisible ">
            <AuthButtons />
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            onClick={handleFilmDetailsModal}
            className={`lg:hidden cursor-pointer  text-neutral-800`}
          >
            {/* <span className="w-full">Similar</span> */}

            <span>
              <ViewIcon className="size-5" />
            </span>
          </button>

          <button
            onClick={onScrollToSection}
            className={`cursor-pointer  text-neutral-800`}
          >
            {/* className={`flex items-center gap-2 text-sml font-semibold cursor-pointer bg-neutral-800 text-white`} */}

            {/* <span className="w-full">Similar</span> */}

            <span>
              <FilmOutlineIcon className="size-4.5" />
            </span>
          </button>
        </div>
      </div>

      <div className="hidden  lg:flex items-center">
        {user ? (
          <div className="wrapper grid grid-cols-[1fr_auto]  gap-4 items-center ">
            <div className="grid grid-cols-2 items-center w-full gap-2">
              <RecentCollection
                filmID={film.id}
                username={user?.username ?? null}
                className="text-sml"
              />

              <button
                className="flex-center cursor-pointer w-fit"
                onClick={handleFilmCollectionModal}
              >
                <ChevronDownIcon className="size-5 text-zinc-500" />
              </button>
            </div>

            <button
              className="bg-neutral-800 rounded-full size-10 grid place-items-center cursor-pointer disabled:opacity-50"
              type="button"
              disabled={
                isLoading || !collectionLastSavedTo || isFilmRecentlySaved
              }
              onClick={handleSaveFilm}
            >
              {isFilmRecentlySaved ? (
                <CheckIcon className={`size-5 text-white`} />
              ) : (
                <AddIcon className={`size-5 text-white`} />
              )}
            </button>
          </div>
        ) : (
          <div className=" flex  items-center justify-end w-full">
            <AuthButtons />
          </div>
        )}
      </div>
    </header>
  );
}

export default FilmDetailsHeader;
