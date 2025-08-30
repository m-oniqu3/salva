import ProfileNav from "@/components/ProfileNav";
import ProfileSummary from "@/components/ProfileSummary";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
};

export default async function ProfileLayout(props: Props) {
  const { children, params } = props;
  const { username } = await params;

  return (
    <>
      <div className="flex flex-col gap-6 py-4">
        <ProfileSummary />
        <ProfileNav username={username} />
      </div>

      {/* Layout UI */}
      {/* Place children where you want to render a page or nested layout */}
      <main>{children}</main>
    </>
  );
}
