"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

export function CreateGroupForm() {
    const utils = api.useUtils();
    const [groupName, setGroupName] = useState('');
    const createGroup = api.group.create.useMutation({
        onSuccess: async () => {
          setGroupName("");
        },
      });
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createGroup.mutate({ name: groupName });
        }}
        className="flex flex-row m-sm align-center gap-4"
      >
        <div className="text-2xl font-bold align-center px-4 py-3 ">New Group</div>
        <input
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        />
        <button type="submit" className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20">Create</button>
      </form>
    </div>
  );
}
