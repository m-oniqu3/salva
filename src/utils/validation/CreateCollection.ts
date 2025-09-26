import { z } from "zod";

export const CreateCollectionSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(3, "Name should be at least 3 characters"),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters long")
    .optional()
    .or(z.literal("")),
  private: z.boolean().optional(),
});

export type CreateCollectionSchema = z.infer<typeof CreateCollectionSchema>;
