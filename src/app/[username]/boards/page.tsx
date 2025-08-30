import Button from "@/components/Button";
import { FilterHorizontalIcon } from "@/components/icons";

function page() {
  return (
    <div>
      <div className="wrapper flex items-center gap-3">
        <FilterHorizontalIcon className="size-6" />

        <Button label="Secret" className="bg-gray-200" />
        <Button label="Favourites" className="bg-gray-200" />
      </div>
    </div>
  );
}

export default page;
