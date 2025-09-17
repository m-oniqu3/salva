import Button from "@/components/Button";
import { FilterHorizontalIcon } from "@/components/icons";

function page() {
  return (
    <div>
      <div className="wrapper flex items-center gap-3">
        <FilterHorizontalIcon className="size-6" />

        <Button className="bg-gray-100 h-8">Secret</Button>
        <Button className="bg-gray-100 h-8">Favorites</Button>
      </div>
    </div>
  );
}

export default page;
