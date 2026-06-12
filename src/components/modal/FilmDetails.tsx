import Button from "@/components/Button";
import FilmHeaderSave from "@/components/films/FilmHeaderSave";
import FilmOverview from "@/components/films/FilmOverview";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";

function FilmDetails() {
  const {
    stopPropagation,
    state: { modal },
    closeModal,
  } = useModal();

  if (!modal) return null;

  const { type, payload } = modal;

  if (type !== ModalEnum.FILM_DETAILS_MODAL || !payload) return null;

  const { data } = payload;

  return (
    <div
      className="panel w-76 h-110 relative  grid grid-rows-[auto_1fr] gap-4"
      onClick={stopPropagation}
    >
      <header className="flex flex-col gap-4">
        <p className="text-xs font-medium text-center">Film Details</p>
      </header>

      <div className="grid grid-rows-[auto_1fr] overflow-scroll no-scrollbar h-full">
        <div className="pt-4">
          <FilmHeaderSave {...data} />
        </div>
        <FilmOverview {...data} />

        <div className="h-16 w-full p-4 flex items-center justify-end gap-4 border-t border-gray-50 shadow-xs absolute bottom-0 left-0 bg-white z-10">
          <Button onClick={closeModal}>Close</Button>
        </div>
      </div>
    </div>
  );
}

export default FilmDetails;
