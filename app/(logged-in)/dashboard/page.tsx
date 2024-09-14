"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
  const { user } = useUser(); // Client-side user
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      // If the user object is undefined, redirect to sign-in
      if (!user) {
        router.push("/sign-in");
        return;
      }

      try {
        // Fetch data from API route
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
  }, [user, router]);

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
