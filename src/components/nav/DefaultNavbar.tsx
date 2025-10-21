import Link from "next/link";

function DefaultNavbar() {
  return (
    <div>
      DefaultNavbar
      <u className="flex gap-4 p-4">
        <Link href="/home">Home</Link>
        <Link href="/hagobi">Profile</Link>
      </u>
    </div>
  );
}

export default DefaultNavbar;
