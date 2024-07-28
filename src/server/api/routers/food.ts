import { Prisma } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const foodRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input, ctx }) => {
      const items = await ctx.db.openfoodfacts.findMany({
        take: 10,
      });

      return items;
    }),
});
