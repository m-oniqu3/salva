import { SearchIcon } from "@/components/icons";

function Searchbar() {
  return (
    <form className="relative w-full ">
      <div className="absolute left-2 top-2 z-10">
        <SearchIcon className="size-5" />
      </div>
      <input
        type="text"
        className="bg-slate-50 w-full text-[0.8rem] h-9 rounded-md pl-8 px-2 focus:outline-none placeholder:text-[0.8rem] placeholder:text-black"
        placeholder="Search"
      />
    </form>
  );
}

export default Searchbar;
