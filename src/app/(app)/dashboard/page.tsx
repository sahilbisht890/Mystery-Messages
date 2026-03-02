"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/models/User";
import ApiResponse from "@/types/apiResponses";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Copy, Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { MessageCard } from "@/components/messageCard";
import Link from "next/link";
import toast from "react-hot-toast";

function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [apiCalled, setApiCalled] = useState(false);

  const handleDeleteMessage = async (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      toast.error("Failed to fetch message settings");
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    setIsSwitchLoading(false);

    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data.messages || []);
      if (response.data.success) {
        toast.success("Messages refreshed");
      } else {
        toast.error("Error while refreshing messages");
      }
    } catch (error) {
      toast.error("Error while fetching messages");
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user || apiCalled) return;
    setApiCalled(true);
    fetchMessages();
    fetchAcceptMessages();
  }, [apiCalled, fetchAcceptMessages, fetchMessages, session]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to update message settings");
    }
  };

  if (!session || !session.user) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8 md:py-16">
        <div className="glass-panel relative overflow-hidden rounded-3xl p-8 md:p-12">
          <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-16 right-0 h-52 w-52 rounded-full bg-orange-400/20 blur-3xl" />

          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
                Dashboard Access
              </p>
              <h2 className="text-3xl font-bold leading-tight text-white md:text-5xl">
                Sign in to unlock your anonymous inbox.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300 md:text-base">
                View incoming messages, control who can contact you, and manage your profile from one clean dashboard experience.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/sign-in"
                  className="rounded-full bg-cyan-400 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Create Account
                </Link>
              </div>
            </div>

            <div className="mx-auto w-full max-w-md">
              <div className="rounded-2xl border border-white/10 bg-[#0d1830]/80 p-4">
                <Image
                  src="/images/Login-amico.svg"
                  alt="Login illustration"
                  width={480}
                  height={480}
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile URL copied to clipboard");
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-10">
      <div className="glass-panel rounded-3xl p-6 md:p-8">
        <h1 className="text-3xl font-bold text-white md:text-4xl">User Dashboard</h1>
        <p className="mt-2 text-sm text-slate-300">Manage your inbox and profile settings in one place.</p>
        <Link
          href="/profile"
          className="mt-4 inline-flex rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
        >
          Edit Profile Details
        </Link>

        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-200"
          />
          <Button onClick={copyToClipboard} className="rounded-xl bg-cyan-400 text-slate-950 hover:bg-cyan-300">
            <Copy className="h-4 w-4" />
            Copy Link
          </Button>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="text-sm text-slate-200">
            Accept Messages: <strong>{acceptMessages ? "On" : "Off"}</strong>
          </span>
        </div>

        <Separator className="my-6 bg-white/10" />

        <Button
          className="rounded-xl border border-white/20 bg-white/5 text-white hover:bg-white/10"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages();
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCcw className="h-4 w-4" />
              Refresh Messages
            </>
          )}
        </Button>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCard
                key={index}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p className="text-slate-300">No messages to display.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default React.memo(Dashboard);
