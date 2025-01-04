"use client";
import { api } from "~/trpc/react";

export function AllMeals() {
  const [Meals] = api.meal.getAll.useSuspenseQuery();

  return (
    <div className="w-full">
      {Meals ? (
        <div className="flex flex-wrap justify-center gap-4">
          {Meals.map((meal) => (
            <div key={meal.id} className="flex flex-col justify-between max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20 w-[18%] sm:w-[18%] md:w-[18%] lg:w-[18%] xl:w-[18%]">
              <h1 className="text-2xl font-bold capitalize">{meal.name}</h1>
              <div className="flex flex-row justify-between">
                <p>{meal.days} day</p>
                {meal.recipeLink && <a  href={meal.recipeLink}><img width="24px" height="24px" src="/icons/recipe.png"></img></a>}
              </div>
            </div>          
          ))}
        </div>
      ) : (
        <p>You have no Meals yet.</p>
      )}
    </div>
  );
}
