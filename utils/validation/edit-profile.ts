import { z } from "zod";

// Define the file size limit and accepted file types as constants
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export const profileAvatarSchema = z.object({
  image: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `Image size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      `Only the following image types are allowed: ${ACCEPTED_IMAGE_TYPES.join(
        ", ",
      )}.`,
    )
    .optional()
    .nullable(),
});

export type ProfileAvatarSchema = z.infer<typeof profileAvatarSchema>;

export const editProfileSchema = z.object({
  firstname: z
    .string()
    .min(3, "Length should be at least 3 characters")
    .optional()
    .or(z.literal("")),

  lastname: z.string().optional().or(z.literal("")),

  username: z
    .string({ message: "Username is required" })
    .min(3, "Length should be at least 3 characters"),

  bio: z
    .string()
    .min(3, "Length should be at least 3 characters")
    .optional()
    .or(z.literal("")),
});

export type EditProfileSchema = z.infer<typeof editProfileSchema>;
