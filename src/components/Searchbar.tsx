import { FilmIcon, SearchIcon } from "@/components/icons";

function Searchbar() {
  return (
    <form className="relative w-full max-w-72 md:max-w-80 lg:max-w-sm mx-auto">
      <div className="absolute top-4 left-5 z-10 ">
        <FilmIcon className="size-5 text-neutral-400 animate-pulse" />
      </div>

      <input
        type="text"
        className="gray w-full text-sml rounded-2xl h-[50px] pl-12 font-medium focus:outline-none placeholder:text-neutral-500"
        placeholder="Search..."
      />

      <div className="absolute top-4.5 right-5 z-10 cursor-pointer">
        <SearchIcon className="size-4 text-neutral-400" />
      </div>
    </form>
  );
}

export default Searchbar;
