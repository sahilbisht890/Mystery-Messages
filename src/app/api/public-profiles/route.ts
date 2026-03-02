import dbConnect from "@/lib/dbConnect";
import userModal from "@/models/User";

export async function GET() {
  await dbConnect();

  try {
    const users = await userModal.aggregate([
      {
        $match: {
          isVerified: true,
          isAcceptingMessage: true,
        },
      },
      {
        $project: {
          username: 1,
          profession: 1,
          gender: 1,
          profilePhoto: 1,
        },
      },
      {
        $sample: {
          size: 12,
        },
      },
    ]);

    return Response.json(
      {
        success: true,
        message: "Open inbox users fetched successfully",
        users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while fetching open inbox users", error);
    return Response.json(
      {
        success: false,
        message: "Server Error",
        users: [],
      },
      { status: 500 }
    );
  }
}
