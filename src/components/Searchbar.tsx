import { SearchIcon, SolidSparkleIcon } from "@/components/icons";

function Searchbar() {
  return (
    <form className="relative w-full max-w-72 md:max-w-96 mx-auto">
      <div className="absolute top-3 left-3 z-10">
        <SolidSparkleIcon className="size-4 text-zinc-400" />
      </div>

      <input
        type="text"
        className="gray w-full text-sml h-10 rounded-xl pl-10 px-4 font-semibold text-zinc-500 focus:outline-none placeholder:text-zinc-400"
        placeholder="Search..."
      />

      <div className="absolute top-3 right-4 z-10 cursor-pointer">
        <SearchIcon className="size-4 text-zinc-400" />
      </div>
    </form>
  );
}

export default Searchbar;
