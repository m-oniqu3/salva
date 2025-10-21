import CollectionSummary from "@/components/collection/CollectionSummary";

type Props = {
  params: Promise<{ profile: string; collection: string }>;
};

function unslugify(slug: string) {
  return slug
    .replace(/-/g, " ") // replace dashes with spaces
    .replace(/\s+/g, " ") // clean up extra spaces
    .trim(); // remove leading/trailing spaces
}

async function page({ params }: Props) {
  const { collection } = await params;
  const decodedCollName = unslugify(collection);

  console.log(decodedCollName);

  return (
    <div>
      <CollectionSummary collection="" />
    </div>
  );
}

export default page;
