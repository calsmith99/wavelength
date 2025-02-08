import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

type Album = {
  rank: string;
  artist: { mbid: string; "#text": string };
  mbid: string;
  name: string;
  playcount: string;
  url: string;
  image?: string; // Add an optional image field
};

type WeeklyAlbumChart = {
  weeklyalbumchart: {
    album: Album[];
  };
};

export const lastFmRouter = createTRPCRouter({
  getDefaultWeeklyChart: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const { username } = input;
      const api_key = process.env.AUTH_LAST_FM_KEY;

      try {
        // Step 1: Fetch the weekly album chart
        const chartRes = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=user.getweeklyalbumchart&user=${username}&api_key=${api_key}&format=json`,
        );
        const chartData: WeeklyAlbumChart = (await chartRes.json()) as WeeklyAlbumChart;

        // Step 2: Fetch additional album info (including images) for each album
        const albumsWithImages = await Promise.all(
          chartData.weeklyalbumchart.album.map(async (album) => {
            try {
                const albumInfoRes = await fetch(
                `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${api_key}&album=${album.name}&artist=${album.artist['#text']}&format=json`,
                );
                const albumInfo = (await albumInfoRes.json()) as {
                album: { image: { "#text": string }[] };
                };

                // Step 3: Assign the image URL to the album
                const image = albumInfo.album.image.reverse().find((img) => img["#text"])?.["#text"];
                return { ...album, image };
            } catch (error) {
                console.error(`Failed to fetch album info for ${album.artist['#text']} - ${album.name}:`, error);
                return album;
            }
          }),
        );

        // Step 4: Return the updated data with images
        return { weeklyalbumchart: { album: albumsWithImages } };
      } catch (error) {
        console.error(error);
        return null;
      }
    }),
});