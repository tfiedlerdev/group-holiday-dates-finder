"use client";
import DatePicker, {
  DateRange,
  DateRangeWithoutDisplayLevel,
} from "../../../date_picker";
import { useCallback, useEffect, useMemo, useState } from "react";
import { addDisplayLevel } from "../../../lib/dates";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { DateRange as PrismaDateRange } from "@prisma/client";
import { NameDialogButton } from "@/app/components/name_dialog_button";
import { CheckIcon } from "@heroicons/react/24/outline";

const submitRanges = async (
  pollId: string,
  currentUsername: string,
  userRanges: DateRangeWithoutDisplayLevel[],
) => {
  try {
    const response = await fetch(`/api/polls/${pollId}/ranges`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: currentUsername,
        ranges: userRanges.map((range) => ({
          startDate: range.start,
          endDate: range.end,
          type: range.type,
          userName: range.userName,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save ranges");
    }
  } catch (error) {
    console.error("Error saving ranges:", error);
  }
};

const fetchPoll = async (pollId: string) => {
  const response = await fetch(`/api/polls/${pollId}`);
  const data = await response.json();

  if (data.success) {
    return {
      ...data.poll,
      startDate:
        data.poll.startDate == null ? null : new Date(data.poll.startDate),
      endDate: data.poll.endDate == null ? null : new Date(data.poll.endDate),
      dateRanges: data.poll.dateRanges.map((range: PrismaDateRange) => ({
        ...range,
        start: new Date(range.startDate),
        end: new Date(range.endDate),
      })),
    };
  }
};

export default function Home() {
  const params = useParams();
  const pollId = params.poll_id as string;
  const [currentUsername, setCurrentUsername] = useState<string | undefined>(
    undefined,
  );
  const [existingUsernames, setExistingUsernames] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [poll, setPoll] = useState<{
    title: string;
    startDate: Date;
    endDate: Date;
    dateRanges: DateRange[];
  } | null>(null);

  const otherUserRanges = useMemo(() => {
    if (!poll) return [];

    const filteredRanges = poll.dateRanges.filter(
      (range) => range.userName !== currentUsername,
    );
    return addDisplayLevel(filteredRanges) as DateRange[];
  }, [currentUsername, poll]);

  const [userRanges, setUserRanges] = useState<DateRangeWithoutDisplayLevel[]>(
    [],
  );

  const fetchPollAndUpdateStates = useCallback(
    async (pollId: string) => {
      const poll = await fetchPoll(pollId);
      setPoll(poll);
      const usernames = [
        ...new Set(
          poll.dateRanges.map((range: PrismaDateRange) => range.userName),
        ),
      ] as string[];
      setExistingUsernames(usernames);
      setUserRanges(
        poll.dateRanges.filter(
          (range: PrismaDateRange) => range.userName === currentUsername,
        ) as DateRangeWithoutDisplayLevel[],
      );
    },
    [currentUsername],
  );
  useEffect(() => {
    fetchPollAndUpdateStates(pollId);
  }, [pollId, fetchPollAndUpdateStates]);

  const handleUsernameSelect = (newUsername: string | null) => {
    if (newUsername) {
      setCurrentUsername(newUsername);
    }
  };

  if (!poll) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen p-4 sm:p-8">
      <main className="flex flex-col gap-6 max-w-4xl mx-auto">
        <Typography
          variant="h4"
          component="h1"
          sx={{ color: "text.primary", fontWeight: "bold" }}
        >
          {poll.title}
        </Typography>

        <DatePicker
          userRanges={userRanges}
          otherUserRanges={otherUserRanges}
          onUserRangesChange={setUserRanges}
          minDate={poll.startDate}
          maxDate={poll.endDate}
          currentUsername={currentUsername}
          className="w-full"
        />

        {currentUsername == null ? (
          <NameDialogButton
            existingUsernames={existingUsernames}
            onUsernameSelect={handleUsernameSelect}
          />
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => {
                setCurrentUsername(undefined);
              }}
            >
              Discard Changes
            </Button>
            <Button
              variant="contained"
              startIcon={<CheckIcon />}
              fullWidth
              disabled={
                userRanges.length ===
                poll.dateRanges.filter((r) => r.userName === currentUsername)
                  .length
              }
              onClick={async () => {
                setIsSubmitting(true);
                await submitRanges(pollId, currentUsername, userRanges);
                setCurrentUsername(undefined);
                await fetchPollAndUpdateStates(pollId);
                setIsSubmitting(false);
              }}
              sx={{
                backgroundColor: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
              loading={isSubmitting}
            >
              {isSubmitting
                ? "Submitting..."
                : `Submit Changes for ${currentUsername}`}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
