import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    updateLastFMName: protectedProcedure
    .input(z.object({ lastFMName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      await ctx.db.user.update({
        where: { id: userId },
        data: { lastFMName: input.lastFMName },
      });
      return { success: true };
    }),
});
