import { AddIcon, CameraIcon } from "@/components/icons";
import { uploadProfileAvatar } from "@utils/api/profile/upload-profile-avatar";
import { profileAvatarSchema } from "@utils/validation/edit-profile";
import Image from "next/image";
import { useRef, useState } from "react";

type Props = {
  avatar: string | null;
  username: string;
};

function ProfileAvatarPicker(props: Props) {
  const { avatar, username } = props;

  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);

  function triggerFileInput() {
    hiddenFileInputRef.current?.click();
  }

  // function to handle file input changes
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarError(null);
    setAvatarPreview("");
    const file = event.target.files?.[0];

    if (!file) return;

    const result = profileAvatarSchema.safeParse(file);

    if (!result.success) {
      setAvatarError(result.error.issues[0].message);
      return;
    }

    // Preview
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);

    uploadAvatar(file);
  };

  async function uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    uploadProfileAvatar(formData);
  }

  return (
    <div>
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="form-label">
          Avatar
        </label>

        {avatarPreview ? (
          <figure className="relative size-20">
            <Image
              src={avatarPreview}
              alt={"Avatar for " + username}
              width={90}
              height={90}
              className="object-cover size-full rounded-xl"
            />
          </figure>
        ) : (
          <>
            {avatar ? (
              <figure className="relative size-20">
                <div
                  className="absolute absolute-center bg-white text-neutral-800 rounded-full size-10 grid place-items-center cursor-pointer z-10"
                  onClick={triggerFileInput}
                >
                  <CameraIcon className="size-5" />
                </div>

                <Image
                  src={avatar}
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
                  className="flex justify-center items-center size-20 rounded-xl gray z-0 cursor-pointer"
                >
                  <AddIcon className="size-5 text-neutral-400" />
                </button>

                <input
                  type="file"
                  ref={hiddenFileInputRef}
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileAvatarPicker;
