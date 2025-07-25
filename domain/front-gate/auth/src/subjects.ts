import z from "zod";

export const subjects = {
  user: z.object({ userId: z.string() }),
};
