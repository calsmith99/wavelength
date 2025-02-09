"use client";
import { useState } from "react";
import { api } from "~/trpc/react";
import { CreateGroupForm } from "../_components/Forms/CreateGroup";
import Link from "next/link";

export default function GroupsPage() {
  const [group, setGroup] = useState('');
  const { data: groups, isLoading, error } = api.group.getGroups.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  console.log("Groups: ", groups);

  return (
    <div className="w-full flex flex-col justify-center gap-4">
      <CreateGroupForm />

      <div className="w-full my-[10px]">
        {groups && (
          <div className="flex flex-col w-full gap-4 justify-center">

            {groups.map((group) => (
              <Link
                key={group.id}
                href={`/groups/group/${group.id}`}
                className="w-full"
              >
                <div className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline text-center transition hover:bg-white/20 w-full">
                  {group.name}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}