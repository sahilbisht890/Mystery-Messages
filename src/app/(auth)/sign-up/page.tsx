"use client";

import ApiResponse from "@/types/apiResponses";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { Loader2, UserPlus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import { useDebounceValue } from "usehooks-ts";
import toast from "react-hot-toast";

export default function SignUpForm() {
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debouncedUsername, setUsername] = useDebounceValue("", 300);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (!debouncedUsername) {
        setUsernameMessage("");
        return;
      }

      setIsCheckingUsername(true);
      setUsernameMessage("");

      try {
        const response = await axios.get<ApiResponse>(
          `/api/check-username-unique?username=${debouncedUsername}`
        );
        setUsernameMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(
          axiosError.response?.data.message ?? "Error checking username"
        );
      } finally {
        setIsCheckingUsername(false);
      }
    };

    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast.success(response.data.message);
      router.replace(`/verify/${data.username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ||
        "There was a problem with your sign-up. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUnique = usernameMessage === "Username is unique";

  return (
    <section className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-7xl items-center gap-6 px-4 py-10 md:grid-cols-2 md:px-8">
      <div className="hidden rounded-3xl border border-white/10 bg-gradient-to-br from-orange-400/20 via-cyan-300/10 to-sky-400/20 p-10 md:block">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-orange-100">
          <Sparkles className="h-4 w-4" />
          New Here?
        </p>
        <h1 className="text-4xl font-bold leading-tight text-white lg:text-5xl">
          Create your anonymous message profile.
        </h1>
        <p className="mt-4 max-w-md text-slate-200">
          Pick a username, verify your email, and start receiving messages in minutes.
        </p>
      </div>

      <div className="glass-panel mx-auto w-full max-w-md rounded-3xl p-8">
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="mt-2 text-sm text-slate-300">Join Mystery Message today</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Username</FormLabel>
                  <Input
                    {...field}
                    className="border-white/15 bg-white/5 text-white placeholder:text-slate-400"
                    placeholder="pick-a-username"
                    onChange={(e) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                    }}
                  />

                  <div className="h-5 text-xs">
                    {isCheckingUsername && (
                      <span className="inline-flex items-center text-slate-300">
                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        Checking username...
                      </span>
                    )}
                    {!isCheckingUsername && usernameMessage && (
                      <span className={isUnique ? "text-emerald-300" : "text-rose-300"}>
                        {usernameMessage}
                      </span>
                    )}
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Email</FormLabel>
                  <Input
                    {...field}
                    name="email"
                    className="border-white/15 bg-white/5 text-white placeholder:text-slate-400"
                    placeholder="you@example.com"
                  />
                  <p className="text-xs text-slate-400">A verification code will be sent to this email.</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Password</FormLabel>
                  <Input
                    type="password"
                    {...field}
                    name="password"
                    className="border-white/15 bg-white/5 text-white placeholder:text-slate-400"
                    placeholder="Create a secure password"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full rounded-xl bg-cyan-400 text-slate-950 hover:bg-cyan-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </>
              )}
            </Button>
          </form>
        </Form>

        <p className="mt-6 text-center text-sm text-slate-300">
          Already a member?{" "}
          <Link href="/sign-in" className="font-semibold text-cyan-300 hover:text-cyan-200">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
