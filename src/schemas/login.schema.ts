import { z } from "zod";

export const loginUserSchema = z.object({
  nick: z.string().min(2, "O nick deve possuir pelo menos 2 caracteres"),
  password: z.string().min(6, "A senha deve possuir pelo menos 6 caracteres"),
});
