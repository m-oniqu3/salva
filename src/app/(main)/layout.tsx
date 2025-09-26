import AuthNavbar from "@/components/nav/AuthNavbar";

type Props = {
  children: React.ReactNode;
};

// check for user here

export default function MainLayout({ children }: Props) {
  return (
    <>
      {/* Layout UI */}
      {/* Place children where you want to render a page or nested layout */}
      <AuthNavbar />
      <main>{children}</main>
    </>
  );
}
