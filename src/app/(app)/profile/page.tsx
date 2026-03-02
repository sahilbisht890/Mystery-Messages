"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ApiResponse, { UserProfileData } from "@/types/apiResponses";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

type FormState = {
  profession: string;
  description: string;
  currentCompany: string;
  gender: string;
  age: string;
};

const initialFormState: FormState = {
  profession: "",
  description: "",
  currentCompany: "",
  gender: "",
  age: "",
};
const MAX_PROFILE_PHOTO_SIZE = 2 * 1024 * 1024;

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get<ApiResponse>("/api/profile");
        const user = response.data.user as UserProfileData | undefined;

        if (user) {
          setFormData({
            profession: user.profession || "",
            description: user.description || "",
            currentCompany: user.currentCompany || "",
            gender: user.gender || "",
            age: user.age ? String(user.age) : "",
          });
          setProfilePhotoUrl(user.profilePhoto || "");
        }
      } catch (error) {
        toast.error("Failed to fetch profile details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [session?.user]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] || null;

    if (!selected) {
      setPhotoFile(null);
      return;
    }

    if (!selected.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      event.target.value = "";
      return;
    }

    if (selected.size > MAX_PROFILE_PHOTO_SIZE) {
      toast.error("Profile photo must be less than 2MB");
      event.target.value = "";
      return;
    }

    setPhotoFile(selected);

    const objectUrl = URL.createObjectURL(selected);
    setProfilePhotoUrl(objectUrl);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const payload = new FormData();
      payload.append("profession", formData.profession);
      payload.append("description", formData.description);
      payload.append("currentCompany", formData.currentCompany);
      payload.append("gender", formData.gender);
      payload.append("age", formData.age);

      if (photoFile) {
        payload.append("profilePhoto", photoFile);
      }

      const response = await axios.put<ApiResponse>("/api/profile", payload);
      const updatedUser = response.data.user;

      if (updatedUser) {
        await update({
          profession: updatedUser.profession,
          description: updatedUser.description,
          currentCompany: updatedUser.currentCompany,
          gender: updatedUser.gender,
          age: updatedUser.age,
          profilePhoto: updatedUser.profilePhoto,
        });
      }

      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (!session?.user) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-7xl items-center justify-center px-4 py-10 md:px-8">
        <div className="glass-panel w-full max-w-xl rounded-3xl p-8 text-center">
          <h1 className="text-2xl font-semibold text-white">Please sign in to edit your profile</h1>
          <Link
            href="/sign-in"
            className="mt-5 inline-flex rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Sign In
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-8 md:px-8 md:py-10">
      <div className="glass-panel rounded-3xl p-6 md:p-8">
        <h1 className="text-3xl font-bold text-white">User Details</h1>
        <p className="mt-2 text-sm text-slate-300">
          Update your personal profile fields and upload a profile photo.
        </p>

        {isLoading ? (
          <div className="mt-6 flex items-center text-slate-300">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading profile...
          </div>
        ) : (
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-full border border-white/20 bg-white/10">
                {profilePhotoUrl ? (
                  <Image
                    src={profilePhotoUrl}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-slate-300">
                    No Photo
                  </div>
                )}
              </div>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10">
                <Upload className="h-4 w-4" />
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-200">Username</label>
                <Input value={session.user.username || ""} disabled className="border-white/15 bg-white/5 text-white" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-200">Email</label>
                <Input value={session.user.email || ""} disabled className="border-white/15 bg-white/5 text-white" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-200">Profession</label>
                <Input
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  placeholder="Software Engineer"
                  className="border-white/15 bg-white/5 text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-200">Current Company</label>
                <Input
                  name="currentCompany"
                  value={formData.currentCompany}
                  onChange={handleChange}
                  placeholder="Company name"
                  className="border-white/15 bg-white/5 text-white"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-200">Gender</label>
                <Input
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  placeholder="Gender"
                  className="border-white/15 bg-white/5 text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-200">Age</label>
                <Input
                  name="age"
                  type="number"
                  min={1}
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  className="border-white/15 bg-white/5 text-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-200">Description</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell people a bit about yourself"
                className="min-h-28 border-white/15 bg-white/5 text-white"
              />
            </div>

            <Button
              type="submit"
              className="rounded-xl bg-cyan-400 text-slate-950 hover:bg-cyan-300"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
