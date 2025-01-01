"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/models/User";
import ApiResponse from "@/types/apiResponses";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { MessageCard } from "@/components/messageCard";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";


function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [apiCalled , setApiCalled] = useState(false);
  const router = useRouter()

  const handleDeleteMessage = async (messageId : string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
      if(response.data.success){
        toast.success(response.data.message);
      }else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Failed to fetch message settings');
    } finally {
      setIsSwitchLoading(false);
    }
  }
  
  const fetchMessages = async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (response.data.success) {
          toast.success('Message refreshed Successfully');
        }else {
          toast.error('Error while refreshing message');
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error('Error while fetching messages');
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    }

  useEffect(() => {
    if (!session || !session.user || apiCalled) return;
    setApiCalled(true);
    fetchMessages();
    fetchAcceptMessages();
  }, []);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      if(response.data.success){
        toast.success(response.data.message);
      }else {
        toast.error(response.data.message);
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
          "Failed to update message settings");
    }
  };

  if (!session || !session.user) {
    return <div className="flex items-center justify-center text-white min-h-screen bg-gray-800">
    <div className="text-center">
      <h2 className="text-5xl font-semibold">Please sign in or sign up</h2>
      <div className="w-1/2 mx-auto my-5">
          <img src='/images/Login-amico.svg'/>
      </div>
      <div className='flex gap-7 justify-center'>
      <Link href="/sign-in">
        <div className="mt-4 inline-block bg-gray-900 text-white py-2 px-4 border border-white rounded hover:scale-110 transition duration-200">
          Sign In
        </div>
      </Link>
      <Link href="/sign-up">
        <div className="mt-4 inline-block bg-gray-900 text-white py-2 px-4 border border-white rounded hover:scale-110 transition duration-200">
          Sign Up
        </div>
      </Link>
      </div>

    </div>
  </div>;
  }


  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success('Profile URL has been copied to clipboard.');
  };

  return (
    <div className="py-6 px-12 bg-gray-800 text-white  w-full h-full">
      <h1 className="text-5xl font-bold mb-4  text-white text-center">
        User Dashboard
      </h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full rounded p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4 flex items-center">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2  font-normal">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4 text-white border border-white hover:scale-105 bg-black"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? ( <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading ... 
        </>
        ) : (<>
              <RefreshCcw className="h-4 w-4" /> Refresh Message
        </>
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={index}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default React.memo(Dashboard);