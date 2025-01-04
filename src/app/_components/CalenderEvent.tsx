import { api } from "~/trpc/react";
import { type FC } from "react";

export const CalenderEvent: FC = () => {
  const addEventMutation = api.calendar.createEvent.useMutation();

  const addEvent = () => {
    addEventMutation.mutate({
      summary: "Added from meal-planner",
      description: "This event was added from the meal planner app",
      start: new Date().toISOString(),
      end: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
    });
  };

  return (
    <button
      onClick={() => addEvent()}
      className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
      disabled={addEventMutation.isPending}
    >
      {addEventMutation.isPending ? "Adding..." : "Add Calender Event"}
    </button>
  );
};
