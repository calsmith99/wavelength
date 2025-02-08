"use client";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { CreateGroupForm } from "../../../_components/Forms/CreateGroup";
import { setgroups } from "process";
import { useParams } from "next/navigation";
import { Chart } from "~/app/_components/Charts/Chart";
import { useSession } from "next-auth/react";


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

    const handleJoinGroup = () => {
        joinGroup.mutate({ groupId });
    };


    const { data: group, isLoading: groupLoading, error: groupError } = api.group.getGroupById.useQuery({ id: groupId });
    const { data: mergedAlbums, isLoading: chartLoading, error: chartError } = api.lastFm.getMergedWeeklyChart.useQuery({ groupId });

    if (groupLoading) return <div>Loading...</div>;
    if (groupError) return <div>Error: {groupError.message}</div>;
    if (chartLoading) return <div>Chart Loading...</div>;
    if (chartError) return <div>Chart Error: {chartError.message}</div>;


    const isCurrentUserInGroup = group?.users.some((user) => user.id === session?.user?.id);


    return (
        <main className="flex min-h-screen flex-col items-center p-6 bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        {group && (
            <div className="w-full">
            <div>
                <h1 className="white text-xl text-center p-5">{group.name}</h1>
            </div>
            <div className="flex flex-row gap-4 w-full">
                <div id="GroupMembers" className="flex flex-col w-[20%] gap-4">
                <div className="white text-xl text-center">Users</div>
                {!isCurrentUserInGroup &&
                    <button
                    onClick={handleJoinGroup}
                    className="bg-black rounded-xl p-4 w-full"
                  >
                    Join Group
                  </button>
                }
                {group.users.map((user) => (
                    <div
                        key={user.id}
                        className={`bg-black rounded-xl p-4 w-full ${hoveredUsername == user.name && 'border-solid border-2'}`}
                        onMouseEnter={() => setHoveredUsername(user.name)}
                        onMouseLeave={() => setHoveredUsername("")}
                    >
                        {user.name}
                    </div>
                ))}
                </div>

                <Chart chart={mergedAlbums} username={hoveredUsername}/>

                <div id="TopSongs" className="flex flex-col w-[20%] gap-4">
                <div className="white text-xl text-center">Top 40:</div>
                <div className="bg-black rounded-xl p-4 w-full">
                    Song 1
                </div>
                <div className="bg-black rounded-xl p-4 w-full">
                    Song 2
                </div>
                <div className="bg-black rounded-xl p-4 w-full">
                    Song 3
                </div>
                </div>

            </div>
            </div>
        )}
        </main>
    )
}