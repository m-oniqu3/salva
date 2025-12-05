import { FilmIcon, SearchIcon } from "@/components/icons";

function Searchbar() {
  return (
    <form className="relative w-full max-w-72 md:max-w-80 lg:max-w-sm mx-auto">
      <div className="absolute top-[15px] left-5 z-10 ">
        <FilmIcon className="size-[23px] text-neutral-400 animate-pulse" />
      </div>

      <input
        type="text"
        className="gray w-full text-sml rounded-full p-4 px-8 pl-14 font-medium focus:outline-none"
        placeholder="Search..."
      />

      <div className="absolute top-[18px] right-5 z-10 cursor-pointer">
        <SearchIcon className="size-4 text-neutral-400" />
      </div>
    </form>
  );
}

export default Searchbar;
