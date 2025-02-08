import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

type Album = {
    name: string;
    playcount: string;
    artist: { "#text": string };
    users: string[]; // Array of user names who contributed to this album
  };

  type WeeklyAlbumChart = {
    weeklyalbumchart: {
      album: Album[];
    };
  };

export const groupRouter = createTRPCRouter({
    create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),        // Meal name must be a non-empty string
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.group.create({
        data: {
            name: input.name,
            users: {
                connect: { id: ctx.session.user.id }, // Associate the current user with the group
            },
        },
      });
    }),
    joinGroup: protectedProcedure
  .input(z.object({ groupId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;

    await ctx.db.group.update({
      where: { id: input.groupId },
      data: {
        users: {
          connect: { id: userId },
        },
      },
    });

    return { success: true };
  }),


    getGroups: protectedProcedure
    .query(async ({ ctx }) => {
      const groups = await ctx.db.group.findMany({
        where: {
            users: {
                some: { id: ctx.session.user.id },
            }
        }
      });
      return groups ?? null;
    }),

    getGroupById: protectedProcedure
    .input(
        z.object({ id: z.string() })
    )
    .query(async ({ ctx, input }) => {
      const group = await ctx.db.group.findUnique({
        where: {
            id: input.id,
        },
        include: {
            users: true
        }
      });
      return group ?? null;
    }),
});
