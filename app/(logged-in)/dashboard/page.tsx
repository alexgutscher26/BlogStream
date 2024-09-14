"use client";

import { useEffect, useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import UpgradeYourPlan from "@/components/upload/upgrade-your-plan";
import UploadForm from "@/components/upload/upload-form";

interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  [key: string]: any;
}

export default function Dashboard() {
  const [planData, setPlanData] = useState({ planTypeName: "", isBasicPlan: false, isProPlan: false });
  const [posts, setPosts] = useState<Post[]>([]);
  const [isValidBasicPlan, setIsValidBasicPlan] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded } = useUser(); // Client-side user

  useEffect(() => {
    const fetchData = async () => {
      // Ensure that user data is fully loaded
      if (!isLoaded || !user) {
        console.error("User data not loaded yet or user is undefined");
        return;
      }

      try {
        // Ensure user.id exists before accessing it
        const userId = user?.id;
        if (!userId) {
          console.error("User ID is undefined");
          return;
        }

        // Fetch data from your API (replace with your API logic)
        const response = await fetch("/api/get-user-data");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch user data");
        }

        const { planTypeName, isBasicPlan, isProPlan, userPosts } = data;

        setPlanData({ planTypeName, isBasicPlan, isProPlan });
        setPosts(userPosts);
        setIsValidBasicPlan(isBasicPlan && userPosts.length < 3);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isLoaded]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while data is being fetched
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        <SignedIn>
          <Badge className="bg-gradient-to-r from-purple-700 to-pink-800 text-white px-4 py-1 text-lg font-semibold capitalize">
            {planData.planTypeName} Plan
          </Badge>

          <h2 className="capitalize text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Start creating amazing content
          </h2>

          <p className="mt-2 text-lg leading-8 text-gray-600 max-w-2xl text-center">
            Upload your audio or video file and let our AI do the magic!
          </p>

          {(planData.isBasicPlan || planData.isProPlan) && (
            <p className="mt-2 text-lg leading-8 text-gray-600 max-w-2xl text-center">
              You get{" "}
              <span className="font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-md">
                {planData.isBasicPlan ? "3" : "Unlimited"} blog posts
              </span>{" "}
              as part of the <span className="font-bold capitalize">{planData.planTypeName}</span> Plan.
            </p>
          )}

          {isValidBasicPlan || planData.isProPlan ? <UploadForm /> : <UpgradeYourPlan />}
          <UserButton /> {/* Show user profile and sign-out option */}
        </SignedIn>

        <SignedOut>
          <div>
            <h2>You are signed out!</h2>
            <SignInButton /> {/* Show sign-in button */}
          </div>
        </SignedOut>
      </div>
    </div>
  );
}
