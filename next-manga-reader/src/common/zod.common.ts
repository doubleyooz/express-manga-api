import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().min(1, "email is required"),
  password: z.string().min(8, "password must be at least 8 characters long"),
});

export type LoginFormProps = z.infer<typeof loginSchema>;
