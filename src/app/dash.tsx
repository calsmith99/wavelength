"use client";

import { useState } from "react";

import { api } from "~/trpc/react";
import { AllMeals } from "./_components/meals";
import { MealForm } from "./_components/meal";
import { WeekCalendar } from "./_components/calendar-week";

export function Dash() {

  return (
    <>
        {/* <WeekCalendar /> */}
        <AllMeals />
        <MealForm />
    </>
  );
}
