import { ArrowLeftIcon } from "@/components/icons";
import Image from "next/image";
import Link from "next/link";

function ProfileHeader() {
  return (
    <header className="flex flex-col gap-2">
      <nav className="wrapper flex items-center h-14">
        <ArrowLeftIcon />
      </nav>

      <div className="flex flex-col items-center gap-4 ">
        <figure>
          <Image
            src="https://i.pinimg.com/1200x/ff/02/39/ff02397557d58cfcf8d8529fc152c62e.jpg"
            alt="Clover from totally spies"
            width="100"
            height="100"
            className="rounded-full object-cover"
          />
        </figure>

        <div className="flex flex-col gap-2  w-full items-center">
          <h1 className="text-3xl font-bold">Alex</h1>

          <div className="center">
            <Link href="#" className="font-bold">
              alexvasquez.com
            </Link>
            &#xb7;
            <p>totally spy!</p>
          </div>

          <div className="center text-zinc-700">
            <p>alexvasquez</p>
            &#xb7;
            <p>she/her</p>
          </div>

          <div className="center">
            <p className="font-bold">39 followers</p>
            &#xb7;
            <p className="font-bold">92 following</p>
          </div>
        </div>

        <button>Edit Profile</button>
      </div>
    </header>
  );
}

export default ProfileHeader;
