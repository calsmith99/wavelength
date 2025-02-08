"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

export function LastFMForm() {
    const utils = api.useUtils();
    const [lastFMName, setLastFMName] = useState('');
    const updateLastFMName = api.user.updateLastFMName.useMutation({
        onSuccess: async () => {
          await utils.user.invalidate();
          setLastFMName("");
        },
      });
  return (
    <div className="w-full max-w-xs">
      <h1 className="text-2xl font-bold text-center">Set Last.FM Username</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateLastFMName.mutate({ lastFMName });
        }}
    >
        <label>
          Last.fm Username:
          <input
            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            type="text"
            value={lastFMName}
            onChange={(e) => setLastFMName(e.target.value)}
          />
        </label>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
