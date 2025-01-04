import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

type CalendarEvent = Record<PropertyKey, string>;

export const calendarRouter = createTRPCRouter({
  createEvent: protectedProcedure
    .input(
      z.object({
        summary: z.string(),
        description: z.string().optional(),
        start: z.string(),
        end: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { summary, description, start, end } = input;
      const account = await ctx.db.account.findFirst({
        where: { userId: ctx.session.user.id },
      });

      try {
        const res = await fetch(
          `${process.env.GOOGLE_API_BASE_URL}/calendars/primary/events`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${account?.access_token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              summary,
              description,
              start: { dateTime: start },
              end: { dateTime: end },
            }),
          },
        );
        const data: CalendarEvent = (await res.json()) as CalendarEvent;
        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
    }),
});
