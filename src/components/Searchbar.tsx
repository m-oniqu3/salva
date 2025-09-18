function Searchbar() {
  return (
    <form className="relative w-full ">
      {/* <div className="absolute left-2 top-2 z-10">
        <SearchIcon className="size-5" />
      </div> */}
      <input
        type="text"
        className="bg-gray-50 w-full text-sm h-10 rounded-lg px-4 focus:outline-none placeholder:text-sm placeholder:text-black"
        placeholder="Search Salva..."
      />
    </form>
  );
}

export default Searchbar;
