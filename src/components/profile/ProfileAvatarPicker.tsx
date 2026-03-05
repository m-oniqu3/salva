import { AddIcon, EditIcon, LoadingIcon } from "@/components/icons";
import { editProfile } from "@utils/api/profile/edit-profile";
import { uploadProfileAvatar } from "@utils/api/profile/upload-profile-avatar";
import { getAvatarURL } from "@utils/get-cover-url";
import { profileAvatarSchema } from "@utils/validation/edit-profile";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

type Props = {
  avatar: string | null;
  username: string;
};

function ProfileAvatarPicker(props: Props) {
  const { avatar, username } = props;

  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  function triggerFileInput() {
    console.log("clicking");
    hiddenFileInputRef.current?.click();
  }

  // function to handle file input changes
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarError(null);

    const file = event.target.files?.[0];

    if (!file) return;

    const result = profileAvatarSchema.safeParse(file);

    if (!result.success) {
      setAvatarError(result.error.issues[0].message);
      return;
    }

    // Preview
    // const url = URL.createObjectURL(file);
    // setAvatarPreview(url);

    uploadAvatar(file);
  };

  async function uploadAvatar(file: File) {
    try {
      setIsEditing(true);
      setAvatarError(null);

      const formData = new FormData();
      formData.append("file", file);

      const { data: avatarURL, error: uploadError } =
        await uploadProfileAvatar(formData);

      if (uploadError) throw uploadError;
      if (!avatarURL) throw new Error("Something went wrong.");

      // Edit profile

      const { error } = await editProfile({ profile: { avatar: avatarURL } });
      if (error) throw error;

      const fullAvatarURL = getAvatarURL(avatarURL);
      setAvatarPreview(fullAvatarURL);

      toast("Profile Updated.");
    } catch (error) {
      console.log(error);
      setAvatarError("Could not update avatar");
    } finally {
      setIsEditing(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="form-label">
          Avatar
        </label>
        <>
          {avatarPreview ? (
            <figure
              className="relative size-20 cursor-pointer"
              onClick={triggerFileInput}
            >
              <div
                className="absolute absolute-center bg-white text-neutral-800 rounded-full size-8 grid place-items-center cursor-pointer z-10"
                onClick={triggerFileInput}
              >
                {isEditing ? (
                  <LoadingIcon className="size-5 animate-spin" />
                ) : (
                  <EditIcon className="size-4" />
                )}
              </div>

              <Image
                src={avatarPreview}
                alt={"Avatar for " + username}
                width={90}
                height={90}
                priority
                className="object-cover size-full rounded-xl"
              />
            </figure>
          ) : (
            <>
              {avatar ? (
                <figure
                  className="relative size-20 cursor-pointer"
                  onClick={triggerFileInput}
                >
                  <div className="absolute absolute-center bg-white text-neutral-800 rounded-full size-8 grid place-items-center cursor-pointer z-10">
                    {isEditing ? (
                      <LoadingIcon className="size-5 animate-spin" />
                    ) : (
                      <EditIcon className="size-4" />
                    )}
                  </div>

                  <Image
                    src={getAvatarURL(avatar)}
                    alt={username}
                    width={90}
                    height={90}
                    className="object-cover size-full rounded-xl"
                  />
                </figure>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    disabled={isEditing}
                    className="flex justify-center items-center size-20 rounded-xl gray z-0 cursor-pointer"
                  >
                    {isEditing ? (
                      <LoadingIcon className="size-5 animate-spin" />
                    ) : (
                      <AddIcon className="size-5 text-neutral-400" />
                    )}
                  </button>
                </>
              )}
            </>
          )}

          <input
            type="file"
            ref={hiddenFileInputRef}
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />

          {avatarError && <p className="input-error">{avatarError}</p>}
        </>
      </div>
    </div>
  );
}

export default ProfileAvatarPicker;
