"use client";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import { useRouter } from "next/navigation";

import Image from "next/image";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";

export default function HomePage() {
  const [dates, setDates] = useState<[Date | null, Date | null] | null>(null);
  const [pollName, setPollName] = useState("Group Holiday Poll");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreatePoll = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
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
        setError(data.error || "Failed to create poll");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating poll:", error);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  }, [dates, pollName, router]);

  console.log("button dsiabled: ", isLoading || !pollName.trim());

  return (
    <>
      <div className="font-sans min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8 pb-24 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="my-16">
              <Image
                src="/logo.png"
                alt="Rather Not Logo"
                width={200}
                height={200}
                priority
                className="mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Group Events Made Easy
            </h3>
            <p className="text-l text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Create a poll to find the best dates for your group event. Collect
              everyone&apos;s availability and make planning effortless. No
              accounts. No ads. Free.
            </p>
          </div>

          {/* Form Section */}
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
              <TextField
                fullWidth
                label="Poll Name"
                variant="outlined"
                value={pollName}
                onChange={(e) => setPollName(e.target.value)}
                className="mb-6"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                    borderRadius: "12px",
                  },
                }}
              />

              <div className="space-y-4">
                <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 border border-slate-600/30 mt-4">
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#94a3b8", // Slate 400 - matching TextField label color
                      fontSize: "1rem",
                      fontWeight: 400,
                      marginBottom: "0.5rem",
                    }}
                  >
                    Date Range (optional)
                  </Typography>
                  <Calendar
                    value={dates}
                    onChange={(e) =>
                      setDates([e?.value?.[0] ?? null, e?.value?.[1] ?? null])
                    }
                    selectionMode="range"
                    readOnlyInput
                    hideOnRangeSelection
                    className="w-full"
                    numberOfMonths={1}
                    showWeek
                    style={{
                      backgroundColor: "transparent",
                      color: "#f8fafc",
                    }}
                  />
                </div>
              </div>

              <div className="mt-8">
                {error && (
                  <Typography
                    color="error"
                    sx={{
                      marginBottom: 2,
                      color: "#ef4444",
                    }}
                  >
                    {error}
                  </Typography>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  className="w-full py-4 px-8 text-lg rounded-xl shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105"
                  onClick={handleCreatePoll}
                  disabled={isLoading || !pollName.trim()}
                  loading={isLoading}
                  loadingPosition="start"
                >
                  {isLoading ? "Creating Poll..." : "Create Poll"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
