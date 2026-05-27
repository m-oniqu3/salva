import Button from "@/components/Button";

function AuthButtons() {
  return (
    <div className="flex gap-4 w-fit">
      <Button>Log In</Button>
      <Button className="bg-neutral-800 text-white">Sign Up</Button>
    </div>
  );
}

export default AuthButtons;
