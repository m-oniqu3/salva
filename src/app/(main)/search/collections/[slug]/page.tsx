import CollectionResults from "@/components/collection/CollectionResults";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

async function page({ params }: Props) {
  const { slug } = await params;

  if (!slug) {
    console.log("No collection present to search");
    redirect("/");
  }

  return (
    <div>
      <CollectionResults searchQuery={slug} />
    </div>
  );
}

export default page;
