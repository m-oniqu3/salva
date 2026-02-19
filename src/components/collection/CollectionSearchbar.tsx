import { CloseIcon, SearchIcon } from "@/components/icons";
import { ChangeEvent } from "react";

type Props = {
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  search: string;
  onClearSearch: () => void;
};

function CollectionSearchbar(props: Props) {
  const { search, onSearchChange, onClearSearch } = props;

  return (
    <form className="grid grid-cols-[30px_auto_30px] ">
      <div className="gray pl-4 flex-center rounded-l-2xl">
        <SearchIcon className="size-4 text-neutral-400" />
      </div>

      <input
        type="text"
        value={search}
        onChange={onSearchChange}
        className="gray w-full text-sml h-[48px] px-4 font-medium focus:outline-none placeholder:text-neutral-500"
        placeholder="Search..."
      />

      <button
        type="button"
        className="gray pr-4 flex-center rounded-r-2xl cursor-pointer"
        onClick={onClearSearch}
      >
        {search && <CloseIcon className="size-4.5 text-neutral-400" />}
      </button>
    </form>
  );
}

export default CollectionSearchbar;
