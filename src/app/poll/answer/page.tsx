"use client";
import Image from "next/image";
import DatePicker, {
  DateRange,
  DateRangeWithoutDisplayLevel,
} from "../../date_picker";
import { useEffect, useMemo, useState } from "react";
import { addDisplayLevel } from "../../lib/dates";

const exampleRanges = [
  {
    start: new Date(2025, 6, 15),
    end: new Date(2025, 6, 20),
    id: "1",
    type: "favorite",
    username: "Sarah Chen",
  },
  {
    start: new Date(2025, 6, 15),
    end: new Date(2025, 6, 19),
    id: "4",
    type: "favorite",
    username: "Peter Chin",
  },
  {
    start: new Date(2025, 7, 5),
    end: new Date(2025, 7, 10),
    id: "2",
    type: "strict_no",
    username: "Michael Rodriguez",
  },
  {
    start: new Date(2025, 8, 15),
    end: new Date(2025, 8, 20),
    id: "3",
    type: "rather_not",
    username: "Emma Thompson",
  },
] as DateRange[];

const CURRENT_USER = "current_user"; // Hardcoded username for demo

export default function Home() {
  const currentUsername = CURRENT_USER;
  const otherUserRanges = useMemo(() => {
    return addDisplayLevel(
      exampleRanges.filter((range) => range.username !== currentUsername),
    ) as DateRange[];
  }, [currentUsername]);
  const [userRanges, setUserRanges] = useState(() => {
    return exampleRanges.filter(
      (range) => range.username === currentUsername,
    ) as DateRangeWithoutDisplayLevel[];
  });
  useEffect(() => console.log(otherUserRanges), [otherUserRanges]);
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <DatePicker
          userRanges={userRanges}
          otherUserRanges={otherUserRanges}
          onUserRangesChange={setUserRanges}
          minDate={new Date(2025, 6, 1)}
          maxDate={new Date(2025, 8, 30)}
          currentUsername={currentUsername}
        />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
