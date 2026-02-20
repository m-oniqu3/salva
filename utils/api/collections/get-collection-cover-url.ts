import { createClient } from "@utils/supabase/client";

export function getCollectionCoverUrl(filePath: string) {
  const supabase = createClient();

  const { data } = supabase.storage
    .from("collection_covers")
    .getPublicUrl(filePath);

  return data.publicUrl;
}
