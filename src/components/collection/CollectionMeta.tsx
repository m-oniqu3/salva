import { type CollectionMeta } from "@/types/collection";
import Image from "next/image";

type Props = {
  collection: CollectionMeta;
  selectCollection: (id: number) => void;
  collectionIsSelected: boolean;
};

function CollectionMeta(props: Props) {
  const {
    collection: { id, cover_image, films_count, name },
    selectCollection,
    collectionIsSelected,
  } = props;

  const image = cover_image ? (
    <figure>
      <Image
        src={cover_image}
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
    <button
      type="button"
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

      <button
        type="button"
        onClick={() => selectCollection(id)}
        className={`size-3  border border-neutral-800 rounded-full cursor-pointer ${collectionIsSelected ? "bg-neutral-800" : ""}`}
      />
    </button>
  );
}

export default CollectionMeta;
