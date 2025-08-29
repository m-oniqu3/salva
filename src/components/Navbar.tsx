import {
  FilmIcon,
  MenuIcon,
  NotificationIcon,
  UserIcon,
} from "@/components/icons";
import Searchbar from "@/components/Searchbar";
import Link from "next/link";

function getRandomUsername() {
  const names = ["Ari", "Dmitri", "Sterling", "Isa", "Roman", "Ilya"];

  const randomNumber = Math.floor(Math.random() * names.length);

  return names[randomNumber].toLowerCase();
}

async function Navbar() {
  console.log(`/${getRandomUsername()}`);
  return (
    <header className="flex items-center h-16 border-b-[1px] border-slate-100">
      <nav className="wrapper flex items-center gap-4 md:gap-6 ">
        <Link href="/">
          <FilmIcon />
        </Link>

        <Searchbar />

        <MenuIcon />

        <Link href={`/${getRandomUsername()}`}>
          <UserIcon />
        </Link>

        <NotificationIcon />
      </nav>
    </header>
  );
}

export default Navbar;
