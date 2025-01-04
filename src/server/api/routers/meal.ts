import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const mealRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),        // Meal name must be a non-empty string
        recipeLink: z.string().nullable()
        .refine(val => val === null || val === "" || /^[a-zA-Z0-9]+:\/\//.test(val), {
          message: "Recipe link must be a valid URL or empty"
        }),   // Recipe link must be a valid URL
        days: z.number().min(1),        // Days should be a positive integer
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.meal.create({
        data: {
          name: input.name,
          recipeLink: input.recipeLink,
          days: input.days,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const meal = await ctx.db.meal.findMany({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });

    return meal ?? null;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
