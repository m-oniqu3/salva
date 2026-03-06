import { createClient } from "@utils/supabase/client";

export function getCollectionCoverUrl(filePath: string) {
  const supabase = createClient();

  const { data } = supabase.storage
    .from("collection_covers")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export function getAvatarURL(filePath: string) {
  const supabase = createClient();

  const { data } = supabase.storage
    .from("profile_avatars")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export function getTMDBImageURL(
  path: string,
  size: "w200" | "w500" | "original" = "w500",
) {
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
