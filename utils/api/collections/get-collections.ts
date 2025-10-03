import getUser from "@/server-actions/get-user";
import { Collection } from "@/types/collection";
import { Result } from "@/types/result";
import { createClient } from "@utils/supabase/server";

export async function getCollections(): Promise<
  Result<Array<Collection> | null>
> {
  try {
    const supabase = await createClient();

    const { data: user, error: userError } = await getUser(supabase);

    if (userError) {
      console.error("Error fetching user:", userError);
      return { data: null, error: "Failed to fetch user." };
    }

    if (!user) {
      return { data: null, error: "Unauthorized: no user found." };
    }

    const { data: collections, error } = await supabase
      .from("collections")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching collections:", error.message);
      return { data: null, error: "Failed to fetch collections." };
    }

    return { data: collections, error: null };
  } catch (err) {
    console.error("Unexpected error in getCollections:", err);
    return { data: null, error: "Unexpected error fetching collections." };
  }
}
