import Link from "next/link";

import { AllMeals } from "~/app/_components/meals";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { Dash } from "./dash";
import { SessionProvider } from "next-auth/react";
import { signIn } from "next-auth/react";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.meal.getAll.prefetch();
  }

  return (
    <HydrateClient>
        <main className="flex min-h-screen flex-col items-center p-6 bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        {session?.user &&
         <div className="flex flex-col items-end self-end justify-end gap-4">
            <p className="text-center text-2xl text-white">
              {session && <span>Logged in as {session.user?.name}</span>}
            </p>
            <p className="text-center text-2xl text-white">
              {session && <span>Last.FM: {session.user?.lastFMName}</span>}
            </p>
            <div className="flex flex-row">
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
              <Link
                href={"/user/settings"}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                Settings
              </Link>
            </div>
          </div>
        }
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              Meal <span className="text-[hsl(280,100%,70%)]">Planner</span>
            </h1>

            {!session &&
              <div className="flex flex-col items-center justify-end gap-4">
                  <Link
                    href="/api/auth/signin"
                    className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
                  >
                    {session ? "Sign out" : "Sign in"}
                  </Link>
                </div>
              }
            {session?.user && <Dash />}
          </div>
        </main>
    </HydrateClient>
  );
}
