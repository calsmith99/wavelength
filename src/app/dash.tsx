"use client";

import { Session } from "next-auth";
import { Chart } from "./_components/Charts/Chart";

interface DashProps {
  session: Session;
}

export function Dash({ session }: DashProps) {
  return (
    <>
      {session.user.lastFMName && <Chart username={session.user.lastFMName} />}
    </>
  );
}