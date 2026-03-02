"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import toast from "react-hot-toast";
import { useState } from "react";
import { Loader2, LockKeyhole, MessageCircleHeart } from "lucide-react";

export default function SignInForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast.error("Incorrect username or password");
      } else {
        toast.error(result.error);
      }
    }

    setIsSubmitting(false);

    if (result?.url) {
      router.replace("/dashboard");
    }
  };

  const onGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <section className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-7xl items-center gap-6 px-4 py-10 md:grid-cols-2 md:px-8">
      <div className="hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-400/20 via-sky-300/10 to-orange-300/20 p-10 md:block">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-100">
          <MessageCircleHeart className="h-4 w-4" />
          Welcome Back
        </p>
        <h1 className="text-4xl font-bold leading-tight text-white lg:text-5xl">
          Continue your anonymous conversations.
        </h1>
        <p className="mt-4 max-w-md text-slate-200">
          Sign in to open your dashboard, refresh your inbox, and control who can send you messages.
        </p>
      </div>

      <div className="glass-panel mx-auto w-full max-w-md rounded-3xl p-8">
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-bold text-white">Sign In</h2>
          <p className="mt-2 text-sm text-slate-300">Access your Mystery Message account</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Email or Username</FormLabel>
                  <Input
                    {...field}
                    disabled={isSubmitting}
                    className="border-white/15 bg-white/5 text-white placeholder:text-slate-400"
                    placeholder="you@example.com"
                  />
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
                    disabled={isSubmitting}
                    className="border-white/15 bg-white/5 text-white placeholder:text-slate-400"
                    placeholder="Enter your password"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-cyan-400 text-slate-950 hover:bg-cyan-300"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <>
                  <LockKeyhole className="h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/15" />
          <span className="text-xs text-slate-400">OR</span>
          <div className="h-px flex-1 bg-white/15" />
        </div>

        <Button
          type="button"
          onClick={onGoogleSignIn}
          disabled={isGoogleSubmitting}
          className="w-full rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/15"
        >
          {isGoogleSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redirecting...
            </>
          ) : (
            <>
              <Image src="/images/google.svg" alt="Google" width={16} height={16} />
              Continue with Google
            </>
          )}
        </Button>

        <p className="mt-6 text-center text-sm text-slate-300">
          Not a member yet?{" "}
          <Link href="/sign-up" className="font-semibold text-cyan-300 hover:text-cyan-200">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}
