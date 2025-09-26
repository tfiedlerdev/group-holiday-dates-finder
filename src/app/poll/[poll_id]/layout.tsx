import type { Metadata } from "next";
import { prisma } from "@/app/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ poll_id: string }>;
}): Promise<Metadata> {
  const { poll_id } = await params;

  try {
    const poll = await prisma.poll.findUnique({
      where: { id: poll_id },
      select: { title: true },
    });

    if (!poll) {
      return {
        title: "Poll Not Found - Rather Not",
        description: "The requested poll could not be found.",
      };
    }

    return {
      title: `${poll.title} - Rather Not`,
      description: `Share your availability for ${poll.title} and help find the best dates for your group event.`,
      openGraph: {
        title: `${poll.title} - Rather Not`,
        description: `Share your availability for ${poll.title} and help find the best dates for your group event.`,
        type: "website",
      },
    };
  } catch {
    return {
      title: "Poll - Rather Not",
      description:
        "Share your availability and help find the best dates for your group event.",
    };
  }
}

export default function PollLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
