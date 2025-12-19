import { CloseIcon } from "@/components/icons";

type Props = { closeModal: () => void };

function Following(props: Props) {
  const { closeModal } = props;
  return (
    <section className="panel p-0 pb-6 max-w-sm overflow-y-auto no-scrollbar flex flex-col">
      <header className="sticky top-0 z-10 p-8 pb-10 bg-white border-b-[1px] border-neutral-50">
        <h1 className="text-lg font-semibold text-neutral-800">Followers</h1>
        <p className="text-sml">Here are your followers.</p>

        <button
          onClick={closeModal}
          className="absolute top-9 right-9 cursor-pointer"
        >
          <CloseIcon className="size-5" />
        </button>
      </header>

      <article className="h-full"></article>
    </section>
  );
}

export default Following;
