import { z } from "zod";

export const createUserSchema = z.object({
  nick: z
    .string()
    .min(2, "O nick deve possuir pelo menos 2 caracteres")
    .regex(/^\S+$/, "O nick não pode conter espaços."),

  email: z.string().email("Informe um email válido"),

  password: z
    .string()
    .min(6, "A senha deve possuir pelo menos 6 caracteres")
    .regex(/[A-Z]/, "A senha deve possuir uma letra maiúscula")
    .regex(/[a-z]/, "A senha deve possuir uma letra minúscula")
    .regex(/[0-9]/, "A senha deve possuir um número")
    .regex(/[^A-Za-z0-9]/, "A senha deve possuir um caractere especial"),
});
