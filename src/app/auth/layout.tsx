import { FilmIcon } from "@/components/icons";
import { checkAuthUser } from "@utils/api/user/check-auth-user";

import Link from "next/link";
import { redirect } from "next/navigation";

type LayoutProps = {
  children: Readonly<React.ReactNode>;
};

async function AuthLayout({ children }: LayoutProps) {
  // get user

  const { data, error } = await checkAuthUser();

  console.log({ data, error });

  if (data) {
    redirect("/home");
  }

  return (
    <section className="wrapper">
      <nav className="h-24  flex items-center">
        <Link href="/" className="">
          <FilmIcon className="size-6 text-neutral-800" />
        </Link>
      </nav>
      {children}
    </section>
  );
}

export default AuthLayout;
