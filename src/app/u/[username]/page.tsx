"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import ApiResponse from "@/types/apiResponses";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";
import toast from "react-hot-toast";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [suggestMessage, setSuggestedMessage] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  useEffect(() => {
    fetchSuggestedMessages();
  }, []);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/suggest-message");
      setSuggestedMessage(response.data.data || []);
    } catch (error) {
      toast.error("Error fetching suggested messages");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-10">
      <div className="glass-panel rounded-3xl p-6 md:p-8">
        <h1 className="text-center text-3xl font-bold text-white md:text-4xl">
          Send an Anonymous Message to @{username}
        </h1>
        <p className="mt-2 text-center text-sm text-slate-300">
          Write your message or use AI suggestions below.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Your Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here"
                      className="min-h-28 resize-none border-white/15 bg-white/5 text-white placeholder:text-slate-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap justify-center gap-3">
              <Button
                className="rounded-xl bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                type="submit"
                disabled={isLoading || !messageContent}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>

              <Button
                onClick={fetchSuggestedMessages}
                className="rounded-xl border border-white/20 bg-white/5 text-white hover:bg-white/10"
                variant="outline"
                disabled={isLoading}
                type="button"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Suggest Messages"
                )}
              </Button>
            </div>
          </form>
        </Form>

        <div className="my-8 space-y-3">
          <p className="text-sm text-slate-300">Tap any suggestion to autofill your message.</p>

          <Card className="border-white/10 bg-[#0f1a33]/70 text-white">
            <CardHeader>
              <h3 className="text-lg font-semibold">Suggestions</h3>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {suggestMessage.length > 0 ? (
                suggestMessage.map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start whitespace-normal border-white/20 bg-white/5 text-left text-slate-200 "
                    onClick={() => handleMessageClick(message)}
                    type="button"
                  >
                    {message}
                  </Button>
                ))
              ) : (
                <p className="text-sm text-slate-400">No suggestions yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6 bg-white/10" />

        <div className="text-center">
          <p className="mb-4 text-sm text-slate-300">Want your own message board?</p>
          <Link href="/sign-up">
            <Button className="rounded-xl bg-cyan-400 text-slate-950 hover:bg-cyan-300">
              Create Your Account
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
