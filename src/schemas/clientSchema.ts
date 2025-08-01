import { z } from "zod";
export const addClientSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    company: z.string().min(1, "Company is required"),
    age: z.coerce
      .number()
      .min(1, "Age must be a number")
      .max(120, "Hey, that's not possible!"),
    gender: z.enum(["male", "female"]),
    currency: z.string().min(1, "Currency is required"),
    subscriptionCost: z.coerce.number().min(0.01, "Must be greater than 0"),
    picture: z.string().optional(),
  })
  .transform(
    (data) =>
      data as {
        id?: string;
        name: string;
        company: string;
        age: number;
        gender: "male" | "female";
        currency: string;
        subscriptionCost: number;
        picture?: string;
      }
  );
export type AddClientData = z.infer<typeof addClientSchema>;
