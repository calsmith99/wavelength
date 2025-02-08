"use client";
import { api } from "~/trpc/react";
import { AlbumTile } from "./AlbumTile";

interface ChartProps {
    chart: any;
    username?: String;
  }

export function Chart({chart, username} : ChartProps) {

  return (
    <div className="w-full">
      {chart ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 justify-center">

          {chart.map((album) => (
            <AlbumTile name={album.name} artist={album.artist['#text']} image={album.image} key={album.url} highlight={album?.users?.includes(username)} />
          ))}
        </div>
      ) : (
        <p>You have no chart.</p>
      )}
    </div>
  );
}
