import Avatar from "@/components/Avatar";
import { type CollectionPreview } from "@/types/collection";
import {
  getAvatarURL,
  getCollectionCoverUrl,
  getTMDBImageURL,
} from "@utils/get-cover-url";
import Image from "next/image";
import Link from "next/link";

type Props = {
  preview: CollectionPreview;
};

//https://picsum.photos/id/237/200/300
function CollectionPreview(props: Props) {
  const { preview } = props;

  const {
    collection: {
      is_private,
      name,
      cover_image,
      cover_type,
      slug,
      film_count,
      created_at,
    },
    user: { username, avatar, firstname },
  } = preview;

  const url =
    cover_image && cover_type === "uploaded"
      ? getCollectionCoverUrl(cover_image)
      : cover_image
        ? getTMDBImageURL(cover_image)
        : null;

  const cover = url ? (
    <Image
      src={url}
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
      <figure className="relative w-full aspect-[5/7] overflow-hidden">
        {cover}
      </figure>

      <figcaption className="flex gap-4 ">
        {/* {avatar && ( */}
        <figure>
          <Avatar
            avatar={avatar ? getAvatarURL(avatar) : ""}
            username={username}
            name={firstname || username}
            className={"size-9 rounded-full"}
          />
        </figure>
        {/* )} */}

        <div className="">
          <h3 className="font-semibold line-clamp-1 w-full text-sml sm:text-sm">
            {name}
          </h3>

          <div className="flex items-center gap-1">
            <p className="text-xs font-medium text-neutral-600">
              {film_count} {film_count === 1 ? "film" : "films"}
              {/* &bull; */}
              {/* <> {formatDate(created_at)}</> */}
            </p>

            {is_private && (
              <p className="flex items-center gap-1">
                <span className="text-neutral-600">&#xb7;</span>
                <span className="text-neutral-600 text-xs font-medium">
                  Private
                </span>
              </p>
            )}
          </div>
        </div>
      </figcaption>
    </Link>
  );
}

export default CollectionPreview;
