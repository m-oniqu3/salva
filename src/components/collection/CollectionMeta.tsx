import { type CollectionMeta } from "@/types/collection";
import { getCollectionCoverUrl } from "@utils/get-cover-url";
import Image from "next/image";

type Props = {
  collections: CollectionMeta[];
  selectCollection: (id: number) => void;
  selectedIDs: Set<number>;
  sectionHeading: string;
};

function SelectCollection(props: Props) {
  const { collections, selectCollection, selectedIDs, sectionHeading } = props;

  return (
    <div className="flex flex-col">
      <p className="text-sml font-medium px-4">{sectionHeading}</p>
      <ul className="flex flex-col h-full p-2 ">
        {collections.map((collection) => {
          const { id, cover_image, cover_type, films_count, name } = collection;
          const isCollectionSelected = selectedIDs.has(id);

          const imageUrl =
            cover_type && cover_image && cover_type === "uploaded"
              ? getCollectionCoverUrl(cover_image)
              : cover_image;

          const url = cover_image ? imageUrl : null;

          const image = url ? (
            <figure>
              <Image
                src={url}
                alt={name}
                width={40}
                height={40}
                className="size-10 object-cover bg-neutral-200 rounded-xl"
              />
            </figure>
          ) : (
            <div className="size-10 bg-neutral-200 rounded-xl" />
          );

          return (
            <li
              key={id}
              onClick={() => selectCollection(id)}
              className="grid place-items-center grid-cols-[40px_auto_40px] p-2 gap-4 rounded-2xl transition-all duration-300 ease-in-out cursor-pointer hover:gray"
            >
              {image}

              <div className="w-full text-start">
                <p className="text-sml line-clamp-1 text-neutral-800 font-medium">
                  {name}
                </p>
                <p className="text-sml text-zinc-500">{films_count} films</p>
              </div>

              <div
                className={`size-3 border border-neutral-800 rounded-full cursor-pointer ${isCollectionSelected ? "bg-neutral-800" : ""}`}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SelectCollection;
