import { createClient } from "@utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  // Get the logged-in user
  const { data } = await supabase.auth.getUser();
  console.log(data);

  if (!data.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Perform database operation for the logged-in user
  const { data: collections, error } = await supabase
    .from("collections")
    .select("*")
    .eq("user_id", data.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: collections }, { status: 200 });
}
