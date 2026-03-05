"use server";

import { Result } from "@/types/result";
import formErrorMesage from "@utils/form-error-message";
import { createClient } from "@utils/supabase/server";

type Props = {
  profile: {
    firstname?: string;
    lastname?: string;
    username?: string;
    avatar?: string;
    bio?: string;
  };
};

type EditProfileResponse = Result<{ username: string } | null>;

export async function editProfile(props: Props): EditProfileResponse {
  try {
    const { firstname, lastname, username, avatar, bio } = props.profile;

    const supabase = await createClient();

    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!auth.user) return { data: null, error: null };

    // Check if username is available
    if (username) {
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .single();
      if (data) throw new Error("Username not available.");
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...(firstname && { firstname }),
        ...(lastname && { lastname }),
        ...(username && { username }),
        ...(avatar && { avatar }),
        ...(bio && { bio }),
      })
      .eq("user_id", auth.user.id)
      .select("username")
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return formErrorMesage(error);
  }
}
