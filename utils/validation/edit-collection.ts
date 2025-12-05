import { z } from "zod";

export const EditedCollectionSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(3, "Name should be at least 3 characters"),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters long")
    .nullish()
    .or(z.literal("")),
});

export type EditedCollection = z.infer<typeof EditedCollectionSchema>;
