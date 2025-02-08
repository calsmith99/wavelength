"use client";

import { Session } from "next-auth";
import { Chart } from "./_components/Charts/Chart";
import { api } from "~/trpc/react";

interface DashProps {
  session: Session;
}

export function Dash({ session }: DashProps) {
  const username = session.user.lastFMName
  const { data, isLoading, error } = api.lastFm.getDefaultWeeklyChart.useQuery({username});

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  const albums = data?.weeklyalbumchart.album;

  return (
    <>
      {session.user.lastFMName && <Chart chart={albums} />}
    </>
  );
}