"use client";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import { useRouter } from "next/navigation";

import Image from "next/image";
import Button from "@mui/material/Button";

export default function Home() {
  const [dates, setDates] = useState<(Date | null)[] | null>([
    new Date(),
    new Date(new Date().setMonth(new Date().getMonth() + 3)),
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreatePoll = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/polls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Group Holiday Poll",
          startDate: dates?.[0]?.toISOString(),
          endDate: dates?.[1]?.toISOString(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/poll/${data.poll.id}/land`);
      } else {
        console.error("Failed to create poll:", data.error);
      }
    } catch (error) {
      console.error("Error creating poll:", error);
    } finally {
      setIsLoading(false);
    }
  };
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
        <Button
          variant="contained"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[90%] py-4 px-8 text-lg"
          onClick={handleCreatePoll}
          disabled={isLoading}
        >
          {isLoading ? "Creating Poll..." : "Create Poll"}
        </Button>
      </main>
    </div>
  );
}
