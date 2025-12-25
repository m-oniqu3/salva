import { type CollectionPreview } from "@/types/collection";
import Image from "next/image";
import Link from "next/link";

type Props = {
  preview: CollectionPreview;
  username: string;
};

function CollectionPreview({ preview, username }: Props) {
  //https://picsum.photos/id/237/200/300

  const { is_private, name, cover_image, slug } = preview;

  const cover = cover_image ? (
    <Image
      src={cover_image as string}
      alt={`cover image for collection:${name}`}
      width={100}
      height={50}
      quality={75}
      className="size-full object-cover rounded-3xl"
    />
  ) : (
    <div className="size-full  grid grid-cols-2 grid-rows-[2fr_1fr] gap-3">
      <div className=" col-span-full rounded-xl bg-neutral-200"></div>

      <div className="col-span-1 rounded-xl bg-neutral-400"></div>
      <div className="col-span-1 rounded-xl bg-neutral-300"></div>
    </div>
  );

  return (
    <Link href={`/${username}/${slug}`} className="flex flex-col gap-4">
      <figure className="h-56 w-full">{cover}</figure>

      <div className="">
        <h3 className="font-semibold line-clamp-1 w-full text-sml">{name}</h3>

        <div className="flex items-center font-semibold gap-1">
          <p className="text-xs font-medium text-zinc-500">
            {name.length.toString().padStart(2, "0")} elements
          </p>

          {is_private && (
            <p className="flex items-center gap-1">
              <span className="text-zinc-500">&#xb7;</span>
              <span className="text-zinc-500 text-xs">Private</span>
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default CollectionPreview;
