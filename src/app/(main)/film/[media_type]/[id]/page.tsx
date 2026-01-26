import { MediaType } from "@/types/tmdb";
import { getFilmById } from "@utils/api/films/get-film-by-id";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ media_type: string; id: number }>;
};

const MediaTypes = ["movie", "tv"] as const;

async function page({ params }: Props) {
  const { media_type, id } = await params;

  if (!media_type || !id) {
    console.log("no media type or id present");
    // todo : show toast

    redirect("/");
  }

  if (!MediaTypes.includes(media_type as MediaType)) {
    console.log(`Invalid media type: ${media_type}`);
    redirect("/");
  }

  if (isNaN(Number(id))) {
    return <div>Invalid film ID</div>;
  }

  const { data, error } = await getFilmById(media_type as MediaType, id);

  if (error) {
    return <div>could not find film</div>;
  }

  console.log(data);

  return <div>{id}</div>;
}

export default page;
