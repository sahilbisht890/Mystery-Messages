import dbConnect from "@/lib/dbConnect";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import userModal from "@/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";

const MAX_PROFILE_PHOTO_SIZE = 2 * 1024 * 1024;

export async function GET() {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as User;

    if (!user?._id) {
      return Response.json(
        { success: false, message: "Not Authenticated" },
        { status: 401 }
      );
    }

    const existingUser = await userModal.findById(user._id).select(
      "username email profession description currentCompany gender age profilePhoto"
    );

    if (!existingUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Profile fetched", user: existingUser },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching profile", error);
    return Response.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as User;

    if (!user?._id) {
      return Response.json(
        { success: false, message: "Not Authenticated" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const profession = (formData.get("profession") as string) || "";
    const description = (formData.get("description") as string) || "";
    const currentCompany = (formData.get("currentCompany") as string) || "";
    const gender = (formData.get("gender") as string) || "";
    const ageValue = (formData.get("age") as string) || "";
    const profileImage = formData.get("profilePhoto") as File | null;

    const updatePayload: {
      profession: string;
      description: string;
      currentCompany: string;
      gender: string;
      age: number | null;
      profilePhoto?: string;
    } = {
      profession: profession.trim(),
      description: description.trim(),
      currentCompany: currentCompany.trim(),
      gender: gender.trim(),
      age: ageValue ? Number(ageValue) : null,
    };

    if (ageValue && Number.isNaN(updatePayload.age)) {
      return Response.json(
        { success: false, message: "Age must be a number" },
        { status: 400 }
      );
    }

    if (profileImage && profileImage.size > 0) {
      if (!profileImage.type.startsWith("image/")) {
        return Response.json(
          { success: false, message: "Only image files are allowed" },
          { status: 400 }
        );
      }

      if (profileImage.size > MAX_PROFILE_PHOTO_SIZE) {
        return Response.json(
          { success: false, message: "Profile photo must be less than 2MB" },
          { status: 400 }
        );
      }

      const imageUrl = await uploadImageToCloudinary(profileImage);
      updatePayload.profilePhoto = imageUrl;
    }

    const updatedUser = await userModal.findByIdAndUpdate(user._id, updatePayload, {
      new: true,
    }).select(
      "username email profession description currentCompany gender age profilePhoto"
    );

    if (!updatedUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Profile updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating profile", error);
    return Response.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
