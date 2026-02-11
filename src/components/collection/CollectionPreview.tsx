import { type CollectionPreview } from "@/types/collection";
import Image from "next/image";
import Link from "next/link";

type Props = {
  preview: CollectionPreview;
  username: string;
};

//https://picsum.photos/id/237/200/300
function CollectionPreview(props: Props) {
  const { preview, username } = props;

  const { is_private, name, cover_image, slug } = preview;

  const cover = cover_image ? (
    <Image
      src={cover_image as string}
      alt={`cover image for collection:${name}`}
      width={100}
      height={50}
      quality={75}
      className="size-full object-cover"
    />
  ) : (
    <div className="size-full gray" />
  );

  return (
    <Link href={`/${username}/${slug}`} className="flex flex-col gap-4 ">
      <figure className="relative w-full aspect-[3/4] overflow-hidden">
        {cover}
      </figure>

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
