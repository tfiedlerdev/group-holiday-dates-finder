"use client";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import React, { useState } from "react";
import { Calendar } from "primereact/calendar";

import Image from "next/image";

export default function Home() {
  const [dates, setDates] = useState<(Date | null)[] | null>([
    new Date(),
    new Date(new Date().setMonth(new Date().getMonth() + 3)),
  ]);
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <Image src="/logo.png" alt="Logo" width={400} height={400} priority />
        <h2 className="text-2xl font-bold text-center">Select Date Range</h2>
        <div className="mx-auto">
          <Calendar
            value={dates}
            onChange={(e) => setDates(e?.value ?? null)}
            selectionMode="range"
            readOnlyInput
            hideOnRangeSelection
            className="w-full bg-white text-black"
            numberOfMonths={2}
            showWeek
          />
        </div>
        <button className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[90%] bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">
          Create Poll
        </button>
      </main>
    </div>
  );
}
