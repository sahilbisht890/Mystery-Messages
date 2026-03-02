"use client";

import Link from "next/link";
import axios from "axios";
import { Loader2, Mail, RefreshCcw, Shield, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import ApiResponse, { PublicUserSummary } from "@/types/apiResponses";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [openUsers, setOpenUsers] = useState<PublicUserSummary[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const messages = [
    {
      title: "Message from User123",
      content: "Hey, how are you doing today?",
      received: "10 minutes ago",
    },
    {
      title: "Message from SecretAdmirer",
      content: "I really liked your recent post!",
      received: "2 hours ago",
    },
    {
      title: "Message from MysteryGuest",
      content: "Do you have any book recommendations?",
      received: "1 day ago",
    },
  ];

  const fetchOpenProfiles = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await axios.get<ApiResponse>("/api/public-profiles");
      setOpenUsers(response.data.users || []);
    } catch (error) {
      setOpenUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchOpenProfiles();
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 md:px-8 md:py-16">
      <section className="glass-panel relative overflow-hidden rounded-3xl px-6 py-12 md:px-12">
        <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-56 w-56 rounded-full bg-orange-400/20 blur-3xl" />

        <div className="relative max-w-3xl">
          <p className="mb-4 inline-flex rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
            Anonymous. Safe. Fun.
          </p>
          <h1 className="text-balance text-4xl font-bold leading-tight text-white md:text-6xl">
            Start conversations without revealing your identity.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            Mystery Message helps people share honest thoughts through private,
            anonymous messages and AI-backed prompt suggestions.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/sign-up"
              className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Create Account
            </Link>
            <Link
              href="/sign-in"
              className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/40 hover:bg-white/10"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="glass-panel border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-cyan-300" />
              Privacy First
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-300">
            Anonymous message flows with account-level controls to manage what you receive.
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-orange-300" />
              Smart Prompts
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-300">
            Generate message ideas instantly when you want help starting a meaningful conversation.
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="h-5 w-5 text-emerald-300" />
              Real-time Inbox
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-300">
            Keep your inbox clean with quick refresh and delete actions from your dashboard.
          </CardContent>
        </Card>
      </section>

      <section className="glass-panel rounded-3xl px-4 py-8 md:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              Open Inbox Users
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Send a random anonymous message to users who are currently accepting messages.
            </p>
          </div>

          <Button
            variant="outline"
            className="rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10"
            onClick={fetchOpenProfiles}
            disabled={isLoadingUsers}
          >
            {isLoadingUsers ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading
              </>
            ) : (
              <>
                <RefreshCcw className="h-4 w-4" />
                Refresh List
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {openUsers.length > 0 ? (
            openUsers.map((user) => (
              <Link
                key={user._id}
                href={`/u/${user.username}`}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-cyan-300/50 hover:bg-white/[0.06]"
              >
                <p className="text-sm text-slate-400">Open inbox</p>
                <p className="mt-1 text-lg font-semibold text-white">@{user.username}</p>
                <p className="mt-3 text-xs text-cyan-300">Send anonymous message</p>
              </Link>
            ))
          ) : (
            <p className="text-sm text-slate-400">
              No open inbox users available right now. Try refresh.
            </p>
          )}
        </div>
      </section>

      <section className="glass-panel rounded-3xl px-4 py-8 md:px-8">
        <h2 className="mb-6 text-center text-2xl font-semibold text-white md:text-3xl">
          Example Message Feed
        </h2>

        <Carousel
          plugins={[Autoplay({ delay: 2500 })]}
          className="mx-auto w-full max-w-3xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-2 md:p-4">
                <Card className="border-white/10 bg-[#0f1a33]/80 text-white">
                  <CardHeader>
                    <CardTitle className="text-xl">{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-start gap-4">
                    <Mail className="mt-1 h-5 w-5 flex-shrink-0 text-cyan-300" />
                    <div>
                      <p className="text-slate-200">{message.content}</p>
                      <p className="mt-2 text-xs text-slate-400">{message.received}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
    </main>
  );
}
