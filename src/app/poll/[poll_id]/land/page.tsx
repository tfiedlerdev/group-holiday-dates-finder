"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Button from "@mui/material/Button";
import { Card, CardContent, Typography, Box } from "@mui/material";

interface Poll {
  id: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
}

export default function PollLandingPage() {
  const params = useParams();
  const pollId = params.poll_id as string;
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await fetch(`/api/polls/${pollId}`);
        if (response.ok) {
          const data = await response.json();
          setPoll(data.poll);
        } else {
          setError("Poll not found");
        }
      } catch (err) {
        setError("Failed to load poll");
        console.error("Error fetching poll:", err);
      } finally {
        setLoading(false);
      }
    };

    if (pollId) {
      fetchPoll();
    }
  }, [pollId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Typography variant="h6">Loading poll...</Typography>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Typography variant="h6" color="error">
          {error || "Poll not found"}
        </Typography>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={200}
            className="mx-auto mb-4"
          />
          <Typography variant="h3" component="h1" className="mb-2">
            {poll.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Poll created on {new Date(poll.createdAt).toLocaleDateString()}
          </Typography>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent>
              <Typography variant="h5" className="mb-4">
                Poll Information
              </Typography>
              <Box className="space-y-2">
                <Typography variant="body1">
                  <strong>Poll ID:</strong> {poll.id}
                </Typography>
                {poll.startDate && (
                  <Typography variant="body1">
                    <strong>Start Date:</strong>{" "}
                    {new Date(poll.startDate).toLocaleDateString()}
                  </Typography>
                )}
                {poll.endDate && (
                  <Typography variant="body1">
                    <strong>End Date:</strong>{" "}
                    {new Date(poll.endDate).toLocaleDateString()}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h5" className="mb-4">
                Actions
              </Typography>
              <div className="space-y-3">
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() =>
                    (window.location.href = `/poll/${pollId}/answer`)
                  }
                >
                  Answer Poll
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  onClick={() =>
                    (window.location.href = `/poll/${pollId}/view`)
                  }
                >
                  View Results
                </Button>
                <Button
                  variant="text"
                  fullWidth
                  onClick={() =>
                    navigator.clipboard.writeText(window.location.href)
                  }
                >
                  Copy Poll Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Typography variant="body2" color="text.secondary">
            Share this poll with your group to find the best dates for your
            holiday!
          </Typography>
        </div>
      </div>
    </div>
  );
}
