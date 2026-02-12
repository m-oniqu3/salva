import { LoadingIcon } from "@/components/icons";

function loading() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-center ">
      <LoadingIcon className="size-5 animate-spin" />
    </div>
  );
}

export default loading;
