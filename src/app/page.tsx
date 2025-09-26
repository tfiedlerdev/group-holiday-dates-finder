"use client";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import { useRouter } from "next/navigation";

import Image from "next/image";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export default function Home() {
  const [dates, setDates] = useState<[Date | null, Date | null] | null>(null);
  const [pollName, setPollName] = useState("Group Holiday Poll");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreatePoll = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/polls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: pollName,
          startDate: dates?.[0]?.toISOString(),
          endDate: dates?.[1]?.toISOString(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/poll/${data.poll.id}/answer`);
      } else {
        console.error("Failed to create poll:", data.error);
      }
    } catch (error) {
      console.error("Error creating poll:", error);
    } finally {
      setIsLoading(false);
    }
  }, [dates, pollName, router]);
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <Image src="/logo.png" alt="Logo" width={400} height={400} priority />
        <TextField
          fullWidth
          label="Poll Name"
          variant="outlined"
          value={pollName}
          onChange={(e) => setPollName(e.target.value)}
          className="max-w-[90%]"
        />
        <h2 className="text-2xl font-bold text-center">Select Date Range</h2>
        <div className="mx-auto">
          <Calendar
            value={dates}
            onChange={(e) =>
              setDates([e?.value?.[0] ?? null, e?.value?.[1] ?? null])
            }
            selectionMode="range"
            readOnlyInput
            hideOnRangeSelection
            className="w-full bg-white text-black"
            numberOfMonths={1}
            showWeek
          />
        </div>
        <Button
          variant="contained"
          className="w-full max-w-[90%] py-4 px-8 text-lg mt-auto"
          onClick={handleCreatePoll}
          disabled={isLoading}
        >
          {isLoading ? "Creating Poll..." : "Create Poll"}
        </Button>
      </main>
    </div>
  );
}
