import Link from "next/link";

import { AllMeals } from "~/app/_components/meals";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { Dash } from "./dash";
import { SessionProvider } from "next-auth/react";
import { signIn } from "next-auth/react";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
        <div className="w-full">
        {session?.user &&
         <div className="flex flex-row justify-between gap-4">
          <div className="flex flex-col items-start">
            <p className="text-center text-2xl text-white">
              {session && <span>Logged in as {session.user?.name}</span>}
            </p>
            <p className="text-center text-2xl text-white">
              {session && <span>Last.FM: {session.user?.lastFMName}</span>}
            </p>
            </div>
            <div className="flex flex-row items-center">
              <Link
                href={"/groups"}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                Your Groups
              </Link>
              <Link
                href={"/user/settings"}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                Settings
              </Link>
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
            </div>
          </div>
        }
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              Wave<span className="text-[hsl(280,100%,70%)]">Length</span>
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
            {session?.user && <Dash session={session} />}
          </div>
        </div>
    </HydrateClient>
  );
}
