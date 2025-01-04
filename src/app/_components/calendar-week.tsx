"use client";
import { api } from "~/trpc/react";

export function WeekCalendar() {
  const [events] = api.calendar.getWeek.useSuspenseQuery();
  return (
    <div className="w-full">
      {events ? (
        <div className="flex flex-wrap justify-center gap-4">
          {events.map((event) => (
            <div key={event.id} className="flex flex-col justify-between max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20 w-[18%] sm:w-[18%] md:w-[18%] lg:w-[18%] xl:w-[18%]">
              <h1 className="text-2xl font-bold capitalize">{event.title}</h1>
            </div>          
          ))}
        </div>
      ) : (
        <p>You have no Meals yet.</p>
      )}
    </div>
  );
}
