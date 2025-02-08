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
    <div className="w-full max-w-xs">
      <h1 className="text-2xl font-bold text-center">New Group</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createGroup.mutate({ name: groupName });
        }}
    >
        <input
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
