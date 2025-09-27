"use server";

import { NewCollectionSchema } from "@utils/validation/create-collection";

export async function createCollection(formData: FormData) {
  try {
    //validate the FormData
    const validatedFields = NewCollectionSchema.parse({
      name: formData.get("name"),
      description: formData.get("description"),
      private: formData.get("private") === "true" ? true : false,
    });
  } catch (error) {}
}
