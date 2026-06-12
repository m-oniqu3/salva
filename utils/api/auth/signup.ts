"use server";

import { createClient } from "@utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;

  const data = {
    email,
    password: formData.get("password") as string,

    options: {
      data: {
        username: email.split("@")[0],
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
