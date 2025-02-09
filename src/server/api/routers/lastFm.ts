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

    getMergedWeeklyChart: protectedProcedure
  .input(z.object({ groupId: z.string() }))
  .query(async ({ ctx, input }) => {
    const group = await ctx.db.group.findUnique({
      where: { id: input.groupId },
      include: { users: true },
    });

    if (!group) return null;

    const api_key = process.env.AUTH_LAST_FM_KEY;

    // Fetch weekly charts for all users in the group
    const charts = await Promise.all(
      group.users.map(async (user) => {
        if (user.lastFMName) {
          // Step 1: Fetch the weekly album chart
          const chartRes = await fetch(
            `https://ws.audioscrobbler.com/2.0/?method=user.getweeklyalbumchart&user=${user.lastFMName}&api_key=${api_key}&format=json`,
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
                return { ...album, image, playcount: parseInt(album.playcount) }; // Convert playcount to a number
              } catch (error) {
                console.error(`Failed to fetch album info for ${album.artist['#text']} - ${album.name}:`, error);
                return { ...album, playcount: parseInt(album.playcount) }; // Convert playcount to a number
              }
            }),
          );

          return { user: user.name, chart: albumsWithImages };
        }
        return { user: user.name, chart: [] };
      })
    );

    // Merge the charts
    const merged: Record<string, Album> = {};
    charts.forEach(({ user, chart }) => {
      chart.forEach((album) => {
        const key = `${album.name}-${album.artist["#text"]}`;
        if (merged[key]) {
          merged[key].playcount += album.playcount; // Add playcount as a number
          merged[key].users.push(user);
        } else {
          merged[key] = {
            ...album,
            playcount: album.playcount, // Save playcount as a number
            users: [user],
          };
        }
      });
    });

    // Convert the merged object to an array and sort by playcount in descending order
    const mergedAlbums = Object.values(merged).sort((a, b) => b.playcount - a.playcount);

    // Return the sorted merged albums
    return mergedAlbums;
  }),
  getTopTracks: protectedProcedure
  .input(z.object({ username: z.string() }))
  .query(async ({ input }) => {
    const { username } = input;
    const api_key = process.env.AUTH_LAST_FM_KEY;

    try {
      // Step 1: Fetch the top tracks for the user
      const topTracksRes = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${api_key}&format=json`,
      );
      const topTracksData = (await topTracksRes.json()) as { toptracks: { track: any[] } };

      // Step 2: Return the top tracks data
      return topTracksData.toptracks;
    } catch (error) {
      console.error(error);
      return null;
    }
  }),
  getMergedTopTracks: protectedProcedure
  .input(z.object({ groupId: z.string() }))
  .query(async ({ ctx, input }) => {
    const group = await ctx.db.group.findUnique({
      where: { id: input.groupId },
      include: { users: true },
    });

    if (!group) return null;

    const api_key = process.env.AUTH_LAST_FM_KEY;

    // Fetch top tracks for all users in the group
    const topTracks = await Promise.all(
      group.users.map(async (user) => {
        if (user.lastFMName) {
          // Step 1: Fetch the top tracks for the user
          const topTracksRes = await fetch(
            `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${user.lastFMName}&api_key=${api_key}&period=7day&format=json`,
          );
          const topTracksData = (await topTracksRes.json()) as {
            toptracks: { track: any[] };
          };

          // Step 2: Map the tracks and add the user's name
          const tracksWithUser = topTracksData.toptracks.track.map((track) => ({
            ...track,
            playcount: parseInt(track.playcount), // Convert playcount to a number
            users: [user.name], // Add the user's name
          }));

          return tracksWithUser;
        }
        return []; // Return an empty array if the user doesn't have a Last.fm name
      }),
    );

    // Merge the tracks
    const merged: Record<string, any> = {};
    topTracks.flat().forEach((track) => {
      const key = `${track.name}-${track.artist.name}`; // Use track name and artist as the key
      if (merged[key]) {
        merged[key].playcount += track.playcount; // Add playcount as a number
        merged[key].users.push(...track.users); // Add the user to the track
      } else {
        merged[key] = {
          ...track,
          users: [...track.users], // Initialize the users array
        };
      }
    });

    // Convert the merged object to an array and sort by playcount in descending order
    const mergedTracks = Object.values(merged).sort((a, b) => b.playcount - a.playcount);

    // Return the sorted merged tracks
    return mergedTracks;
  }),
  getAlbums: protectedProcedure
  .input(z.object({ album: z.string() }))
  .query(async ({ input }) => {
    const { album } = input;
    const api_key = process.env.AUTH_LAST_FM_KEY;

    try {
      // Step 1: Fetch the top tracks for the user
      const albumsRes = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${album}&api_key=${api_key}&format=json`,
      );
      const albums = (await albumsRes.json()) as { albums: { album: any[] } };

      // Step 2: Return the top tracks data
      return albums;
    } catch (error) {
      console.error(error);
      return null;
    }
  }),
});