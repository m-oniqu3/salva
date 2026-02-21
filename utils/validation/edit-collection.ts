import { z } from "zod";

export const EditedCollectionSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(3, "Name should be at least 3 characters"),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters")
    .nullish()
    .or(z.literal("")),
});

export type EditedCollection = z.infer<typeof EditedCollectionSchema>;

// Define the file size limit and accepted file types as constants
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export const collectionImageSchema = z.object({
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

export type CollectionImageSchema = z.infer<typeof collectionImageSchema>;
