import { Badge } from "@/components/ui/badge";
import UpgradeYourPlan from "@/components/upload/upgrade-your-plan";
import UploadForm from "@/components/upload/upload-form";
import getDbConnection from "@/lib/db";
import {
  doesUserExist,
  getPlanType,
  hasCancelledSubscription,
  updateUser,
} from "@/lib/user-helpers";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return redirect("/sign-in");
  }

  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? ""; // Added optional chaining

  const sql = await getDbConnection().catch((err) => {
    console.error("Failed to connect to the database:", err);
  });

  if (!sql) return;

  let userId = null;
  let priceId = null;

  const hasUserCancelled = await hasCancelledSubscription(sql, email).catch((err) => {
    console.error("Failed to check if the user has cancelled their subscription:", err);
  });

  const user = await doesUserExist(sql, email).catch((err) => {
    console.error("Failed to check if the user exists:", err);
  });

  if (!user) {
    console.log("User does not exist in the database.");
    return;
  }

  userId = clerkUser?.id; // Ensure clerkUser is defined before accessing id
  if (userId) {
    await updateUser(sql, userId, email).catch((err) => {
      console.error("Failed to update the user ID:", err);
    });
    console.log(`Updated user ${email} with ID ${userId}`);
  }

  priceId = user[0].price_id;

  const { id: planTypeId = "starter", name: planTypeName } = getPlanType(priceId);

  const isBasicPlan = planTypeId === "basic";
  const isProPlan = planTypeId === "pro";

  const posts = await sql`SELECT * FROM posts WHERE user_id = ${userId}`.catch((err) => {
    console.error("Failed to fetch posts for the user:", err);
  });

  if (!posts) {
    console.log("No posts found for the user.");
    return;
  }

  const isValidBasicPlan = isBasicPlan && posts.length < 3;

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        {/* Enhanced Badge Styling */}
        <Badge className="bg-gradient-to-r from-purple-600 to-pink-700 text-white px-5 py-2 text-lg font-semibold shadow-lg rounded-lg transition-transform transform hover:scale-105">
          {planTypeName} Plan
        </Badge>

        {/* Heading and Subtext */}
        <h2 className="capitalize text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Start creating amazing content
        </h2>
        <p className="mt-4 text-lg leading-8 text-gray-600 max-w-3xl text-center">
          Upload your audio or video file and let our AI do the magic!
        </p>

        {/* Plan Information */}
        {(isBasicPlan || isProPlan) && (
          <p className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl text-center fade-in">
            You get{" "}
            <span className="font-bold text-amber-600 bg-amber-100 px-3 py-1 rounded-md">
              {isBasicPlan ? "3" : "Unlimited"} blog posts
            </span>{" "}
            as part of the{" "}
            <span className="font-bold capitalize">{planTypeName}</span> Plan.
          </p>
        )}

        {/* Form or Upgrade Button */}
        {isValidBasicPlan || isProPlan ? (
          <div className="mt-6 w-full max-w-md">
            <UploadForm />
          </div>
        ) : (
          <div className="mt-6">
            <UpgradeYourPlan />
          </div>
        )}
      </div>
    </div>
  );
}
