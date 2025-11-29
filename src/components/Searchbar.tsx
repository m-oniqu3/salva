import { SearchIcon, SolidSparkleIcon } from "@/components/icons";

function Searchbar() {
  return (
    <form className="relative w-full max-w-72 md:max-w-80 lg:max-w-96 mx-auto">
      <div className="absolute top-[14px] left-4 z-10 ">
        <SolidSparkleIcon className="size-[16px] text-gray-500 animate-pulse" />
      </div>

      <input
        type="text"
        className="gray w-full text-sml h-11 rounded-[14px] pl-11 px-4 font-medium text-gray-700 focus:outline-none placeholder:text-gray-500"
        placeholder="Search..."
      />

      <div className="absolute top-[14px] right-4 z-10 cursor-pointer">
        <SearchIcon className="size-[15px] text-gray-500" />
      </div>
    </form>
  );
}

export default Searchbar;
