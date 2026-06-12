"use client";

import Button from "@/components/Button";
import { useRouter } from "next/navigation";

function AuthButtons() {
  const router = useRouter();

  function handleAuth() {
    router.push("/auth");
  }

  return (
    <div className="flex w-fit gap-4">
      <Button onClick={handleAuth} className="hover:gray">
        Log In
      </Button>
      <Button onClick={handleAuth} className="bg-neutral-800 text-white">
        Sign Up
      </Button>
    </div>
  );
}

export default AuthButtons;
