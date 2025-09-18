import { SearchIcon } from "@/components/icons";

function Searchbar() {
  return (
    <form className="relative w-full max-w-sm ">
      <input
        type="text"
        className="bg-gray-50 w-full text-sm h-10 rounded-lg px-4 focus:outline-none placeholder:text-sm placeholder:text-gray-500"
        placeholder="Search..."
      />

      <div className="absolute top-3 right-3  z-10">
        <SearchIcon className="size-4 text-gray-500" />
      </div>
    </form>
  );
}

export default Searchbar;
