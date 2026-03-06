"use client";

import Button from "@/components/Button";
import { LoadingIcon } from "@/components/icons";
import ProfileAvatarPicker from "@/components/profile/ProfileAvatarPicker";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfile } from "@utils/api/profile/edit-profile";
import {
  editProfileSchema,
  EditProfileSchema,
} from "@utils/validation/edit-profile";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function hasChanged(source: string, target: string | undefined) {
  return source.trim() !== target?.trim();
}

function EditProfile() {
  const {
    stopPropagation,
    closeModal,
    state: { modal },
  } = useModal();

  const router = useRouter();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const profileSummary =
    modal?.type === ModalEnum.EDIT_PROFILE
      ? modal.payload?.profileSummary
      : null;

  const form = useForm<EditProfileSchema>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstname: profileSummary?.firstname ?? "",
      lastname: profileSummary?.lastname ?? "",
      username: profileSummary!.username,
      bio: profileSummary?.bio,
    },
  });

  const errors = form.formState.errors;

  async function handleSave(inputs: EditProfileSchema) {
    try {
      setIsEditingProfile(true);

      if (!profileSummary) return;
      const { firstname, lastname, username, bio } = profileSummary;

      const firstNameChanged = hasChanged(firstname, inputs.firstname);
      const lastNameChanged = hasChanged(lastname, inputs.lastname);
      const usernameChanged = hasChanged(username, inputs.username);
      const bioChanged = hasChanged(bio, inputs.bio);

      if (
        !lastNameChanged &&
        !firstNameChanged &&
        !bioChanged &&
        !usernameChanged
      ) {
        return;
      }

      const changes = {
        ...(firstNameChanged && { firstname: inputs.firstname }),
        ...(lastNameChanged && { lastname: inputs.lastname }),
        ...(usernameChanged &&
          inputs.username && { username: inputs.username }),
        ...(bioChanged && { bio: inputs.bio }),
      };

      const { data, error } = await editProfile({ profile: changes });

      if (error) throw error;

      if (!data) throw new Error("Something went wrong.");

      const { username: new_username } = data;
      router.replace("/" + new_username);

      toast("Profile updated.");

      closeModal();
    } catch (error) {
      console.log(error);

      const message = (error as unknown as string)
        .toLowerCase()
        .includes("username")
        ? (error as string)
        : "Could not edit your collection.";

      form.setError("root", { message });
    } finally {
      setIsEditingProfile(false);
    }
  }

  return (
    <form
      className="panel rounded-3xl flex flex-col gap-4  mx-auto relative overflow-hidden h-110 w-76"
      onClick={stopPropagation}
      onSubmit={form.handleSubmit(handleSave)}
    >
      <header>
        <p className="font-medium text-xs text-neutral-800 text-center">
          Edit Profile
        </p>

        {errors.root && (
          <p className="py-1 input-error text-center">{errors.root.message}</p>
        )}
      </header>

      <div className="grid grid-rows-[1fr_64px] h-full overflow-scroll no-scrollbar">
        <div className="flex flex-col gap-5">
          <ProfileAvatarPicker
            avatar={profileSummary?.avatar ?? null}
            username={profileSummary!.username}
          />

          <div>
            {/* names */}
            <div className="flex gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="form-label">
                  Firstname
                </label>

                <input
                  {...form.register("firstname")}
                  placeholder="Patrick"
                  className="input h-9 gray"
                />

                <p className="input-error">{errors.firstname?.message}</p>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="form-label">
                  Lastname
                </label>

                <input
                  {...form.register("lastname")}
                  placeholder="Jane"
                  className="input h-9 gray"
                />

                <p className="input-error">{errors.firstname?.message}</p>
              </div>
            </div>

            {/* username */}
            <div className="flex flex-col gap-1">
              <label htmlFor="username" className="form-label">
                Username
              </label>

              <input
                {...form.register("username")}
                className="input h-9 gray"
              />

              <p className="input-error">{errors.username?.message}</p>
            </div>

            {/* bio */}
            <div className="flex flex-col gap-1">
              <label htmlFor="bio" className="form-label">
                bio
              </label>

              <textarea
                {...form.register("bio")}
                className="input h-16 resize-none gray no-scrollbar"
                placeholder="Film enthusiast"
              ></textarea>

              <p className="input-error">{errors.bio?.message}</p>
            </div>
          </div>
        </div>

        <div className="h-16 w-full p-4 flex items-center justify-end gap-4 border-t border-gray-50 shadow-xs absolute bottom-0 left-0 bg-white z-10">
          <Button onClick={closeModal}>Cancel</Button>

          <Button
            type="submit"
            disabled={isEditingProfile}
            className="text-white bg-neutral-800"
          >
            {isEditingProfile ? (
              <p className="flex items-center gap-1">
                Saving
                <LoadingIcon className="animate-spin size-4" />
              </p>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default EditProfile;
