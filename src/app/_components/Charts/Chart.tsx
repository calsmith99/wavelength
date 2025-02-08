"use client";
import { api } from "~/trpc/react";
import { AlbumTile } from "./AlbumTile";

interface ChartProps {
    username: String;
  }

export function Chart({username} : ChartProps) {
    const { data, isLoading, error } = api.lastFm.getDefaultWeeklyChart.useQuery({username});

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    const albums = data?.weeklyalbumchart.album;
    console.log(albums);

  return (
    <div className="w-full">
      {albums ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 justify-center">

          {albums.map((album) => (
            <AlbumTile name={album.name} artist={album.artist['#text']} image={album.image} key={album.url} />
          ))}
        </div>
      ) : (
        <p>You have no chart.</p>
      )}
    </div>
  );
}
