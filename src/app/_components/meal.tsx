"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

export function MealForm() {
  const utils = api.useUtils();
  const [name, setName] = useState("");
  const [recipeLink, setRecipeLink] = useState("");
  const [days, setDays] = useState(1);
  const createMeal = api.meal.create.useMutation({
    onSuccess: async () => {
      await utils.meal.invalidate();
      setName("");
      setRecipeLink("");
      setDays(1);
    },
  });

  return (
    <div className="w-full max-w-xs">
      <h1 className="text-2xl font-bold text-center">Add Meal</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createMeal.mutate({ name, recipeLink, days });
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <input
          type="text"
          placeholder="Recipe Link"
          value={recipeLink}
          onChange={(e) => setRecipeLink(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <input
          type="number"
          placeholder="Days"
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createMeal.isPending}
        >
          {createMeal.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
