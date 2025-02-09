"use client";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { CreateGroupForm } from "../../../_components/Forms/CreateGroup";
import { setgroups } from "process";
import { useParams } from "next/navigation";
import { Chart } from "~/app/_components/Charts/Chart";
import { useSession } from "next-auth/react";
import Link from "next/link";


type Album = {
    name: string;
    playcount: string;
    artist: { "#text": string };
    users: string[]; // Array of user names who contributed to this album
  };

export default function GroupPage() {
    const params = useParams();
    const groupId = params.id as string; // Get the ID from the URL
    const { data: session } = useSession();
    const joinGroup = api.group.joinGroup.useMutation();
    const [hoveredUsername, setHoveredUsername] = useState('');
    const username = session?.user?.lastFMName;

    const handleJoinGroup = () => {
        joinGroup.mutate({ groupId });
    };


    const { data: group, isLoading: groupLoading, error: groupError } = api.group.getGroupById.useQuery({ id: groupId });
    const { data: mergedAlbums, isLoading: chartLoading, error: chartError } = api.lastFm.getMergedWeeklyChart.useQuery({ groupId });
    const { data: topTracks, isLoading: tracksLoading, error: tracksError } = api.lastFm.getMergedTopTracks.useQuery({ groupId });

    if (groupLoading) return <div>Loading...</div>;
    if (groupError) return <div>Error: {groupError.message}</div>;
    if (chartLoading) return <div>Chart Loading...</div>;
    if (chartError) return <div>Chart Error: {chartError.message}</div>;
    if (tracksLoading) return <div>Tracks Loading...</div>;
    if (tracksError) return <div>Tracks Error: {tracksError.message}</div>;

    const top40 = topTracks.slice(0, 40);

    const isCurrentUserInGroup = group?.users.some((user) => user.id === session?.user?.id);


    return (
        <div className="w-full">
        {group && (
            <div>
                <div id="TopBar" className="flex flex-row items-center justify-between mb-8">
                    <Link href='/'>
                        <div className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20">
                            Home
                        </div>
                    </Link>
                    <div className="white text-4xl text-center p-5 absolute left-1/2 transform -translate-x-1/2">{group.name}</div>
                </div>
                <div className="flex flex-row gap-4 w-full">
                    <div id="GroupMembers" className="flex flex-col w-[20%] gap-4">
                    <div className="white text-xl text-center py-2">Users</div>
                    {!isCurrentUserInGroup &&
                        <button
                        onClick={handleJoinGroup}
                        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
                    >
                        Join Group
                    </button>
                    }
                    {group.users.map((user) => (
                        <div
                            key={user.id}
                            className={`rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20 ${hoveredUsername == user.name && 'border-solid border-2'}`}
                            onMouseEnter={() => setHoveredUsername(user.name)}
                            onMouseLeave={() => setHoveredUsername("")}
                        >
                            {user.name}
                        </div>
                    ))}
                    </div>

                    <Chart chart={mergedAlbums} username={hoveredUsername}/>

                    <div id="TopSongs" className="flex flex-col w-[20%] gap-4">
                    <div className="white text-xl text-center py-2">Top 40:</div>
                        {top40?.map((track, idx) => (
                            <div key={idx} className={`flex flex-col rounded-xl gap-2 bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20 ${track?.users?.includes(hoveredUsername) && 'border-solid border-2'}`}>
                                <div>{idx+1}. {track.name}</div>
                                <div>{track.artist.name}</div>
                                <div>Play Count: {track.playcount}</div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        )}
        </div>
    )
}