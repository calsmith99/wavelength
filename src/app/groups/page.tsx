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
    <main className="flex min-h-screen flex-col items-center p-6 bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <CreateGroupForm />

      <div className="w-full">
        {groups && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 justify-center">

            {groups.map((group) => (
              <Link
                key={group.id}
                href={`/groups/group/${group.id}`}
              >
                <div className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20">
                  {group.name}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </main>
  );
}