import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { mealRouter } from "~/server/api/routers/meal";
import { calendarRouter } from "~/server/api/routers/calender";
import { userRouter } from "~/server/api/routers/user";
import { lastFmRouter } from "~/server/api/routers/lastFm";
import { groupRouter } from "~/server/api/routers/group";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  meal: mealRouter,
  calendar: calendarRouter,
  user: userRouter,
  lastFm: lastFmRouter,
  group: groupRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
