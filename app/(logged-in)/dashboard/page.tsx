import { Badge } from "@/components/ui/badge";
import UpgradeYourPlan from "@/components/upload/upgrade-your-plan";
import UploadForm from "@/components/upload/upload-form";
import getDbConnection from "@/lib/db";
import { doesUserExist, getPlanType, hasCancelledSubscription, updateUser } from "@/lib/user-helpers";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';  // This ensures dynamic rendering in Next.js App Directory

export default async function Dashboard() {
  try {
    const clerkUser = await currentUser();

    // Ensure user is authenticated
    if (!clerkUser) {
      console.error("No authenticated user found, redirecting to sign-in");
      return redirect("/sign-in");
    }

    const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? "";
    console.log("Current user's email:", email);

    const sql = await getDbConnection().catch((err) => {
      console.error("Failed to connect to the database:", err);
    });

    if (!sql) {
      console.error("No SQL connection, exiting");
      return;
    }

    // Check if the user has a canceled subscription
    const hasUserCancelled = await hasCancelledSubscription(sql, email).catch((err) => {
      console.error("Failed to check if the user has cancelled their subscription:", err);
    });

    // Check if the user exists in the database
    const user = await doesUserExist(sql, email).catch((err) => {
      console.error("Failed to check if the user exists:", err);
    });

    if (!user) {
      console.log("User does not exist in the database.");
      return;
    }

    // Assign the Clerk user ID
    const userId = clerkUser?.id;
    if (userId) {
      await updateUser(sql, userId, email).catch((err) => {
        console.error("Failed to update the user ID:", err);
      });
      console.log(`Updated user ${email} with ID ${userId}`);
    }

    // Extract priceId and handle undefined cases
    const priceId = user[0]?.price_id;
    if (!priceId) {
      console.error("Price ID is missing for the user.");
      return;
    }

    const { id: planTypeId = "starter", name: planTypeName } = getPlanType(priceId);
    console.log("User plan type:", planTypeName);

    const isBasicPlan = planTypeId === "basic";
    const isProPlan = planTypeId === "pro";

    // Fetch posts for the user
    const posts = await sql`SELECT * FROM posts WHERE user_id = ${userId}`.catch((err) => {
      console.error("Failed to fetch posts for the user:", err);
    });

    if (!posts || posts.length === 0) {
      console.log("No posts found for the user.");
    } else {
      console.log("Fetched posts:", posts);
    }

    const isValidBasicPlan = isBasicPlan && posts?.length !== undefined && posts.length < 3;

    return (
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-700 text-white px-5 py-2 text-lg font-semibold shadow-lg rounded-lg transition-transform transform hover:scale-105">
            {planTypeName} Plan
          </Badge>

          <h2 className="capitalize text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Start creating amazing content
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 max-w-3xl text-center">
            Upload your audio or video file and let our AI do the magic!
          </p>

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
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return <div>Something went wrong. Please try again later.</div>;
  }
}
