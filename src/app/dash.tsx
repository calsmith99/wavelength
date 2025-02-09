"use client";

import { Session } from "next-auth";
import { Chart } from "./_components/Charts/Chart";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";

interface DashProps {
  session: Session;
}

function useDebounce(value: string, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function Dash({ session }: DashProps) {
  const [albumSearch, setAlbumSearch] = useState('');
  const debouncedSearch = useDebounce(albumSearch, 500); // Wait 500ms after last keystroke

  const username = session.user.lastFMName
  const { data, isLoading, error } = api.lastFm.getDefaultWeeklyChart.useQuery({username});

  const getAlbums = api.lastFm.getAlbums.useQuery(
    { album: debouncedSearch },
    { enabled: !!debouncedSearch } // Only fetch if there's a search term
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  const albums = data?.weeklyalbumchart.album;
  const searchResults = getAlbums.data; // Fetched album search results

  const handleDragStart = (e, name, artist, image) => {
    const data = {
      'name': name,
      'artist': artist,
      'image': image
    };
    e.dataTransfer.setData("text/json", JSON.stringify(data)); // Store the index of the dragged item
  };



  return (
    <div className="w-full">
      <div id="albumSearch" className="w-full flex flex-col items-center sticky top-0 z-10 gap-2">
        <div className="flex flex-row py-2 justify-around">
          <div id="searchBox">
                <input
                  className="rounded-full bg-[#3e1f75] px-10 py-3 font-semibold no-underline transition text-center hover:bg-[#543883]"
                  type="text"
                  placeholder="Search Album"
                  value={albumSearch}
                  onChange={(e) => setAlbumSearch(e.target.value)}
                />
          </div>
        </div>
        {albumSearch && (
          <div id="results" className="w-full grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-2 justify-center max-h-[180px] overflow-y-scroll mb-10">
            {searchResults?.results?.albummatches?.album.map((album) => (
              <div
              key={album.url}
              draggable
              onDragStart={(e) => handleDragStart(e, album.name, album.artist, album.image.at(-1)['#text'])}
              >
              <div
                key={album.id}
                className="aspect-square"
                style={{
                  backgroundImage: `url(${album.image.at(-1)['#text']})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                }}
                ></div>
              </div>
            ))}
          </div>
      )}
      </div>
      {session.user.lastFMName && <Chart chart={albums} />}
    </div>
  );
}