import {
  FilmIcon,
  MenuIcon,
  NotificationIcon,
  UserIcon,
} from "@/components/icons";
import Searchbar from "@/components/Searchbar";

function Navbar() {
  return (
    <header className="flex items-center h-16">
      <nav className="wrapper flex items-center gap-4 md:gap-6 ">
        <FilmIcon className="size-8" />
        <Searchbar />
        <MenuIcon className="size-8" />
        <UserIcon className="size-8" />
        <NotificationIcon className="size-8" />
      </nav>
    </header>
  );
}

export default Navbar;
