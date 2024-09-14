// /pages/api/get-user-data.ts
import { NextApiRequest, NextApiResponse } from "next";
import getDbConnection from "@/lib/db";
import { getPlanType, doesUserExist, updateUser } from "@/lib/user-helpers";
import { currentUser } from "@clerk/nextjs/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get current user from Clerk
    const user = await currentUser();
    
    if (!user) {
      console.error("User is not authenticated.");
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Connect to the database
    const sql = await getDbConnection().catch((err) => {
      console.error("Failed to connect to the database:", err);
      throw new Error("Database connection failed");
    });

    const email = user.emailAddresses?.[0]?.emailAddress ?? "";

    // Check if user exists in the database
    const dbUser = await doesUserExist(sql, email);
    if (!dbUser) {
      console.error(`User with email ${email} does not exist in the database.`);
      return res.status(404).json({ message: "User does not exist in the database" });
    }

    // Get user ID and update user in the database
    const userId = user.id;
    await updateUser(sql, userId, email);

    // Get plan details
    const priceId = dbUser[0]?.price_id;
    if (!priceId) {
      console.error("No price ID found for user.");
      return res.status(400).json({ message: "No pricing information available for the user" });
    }

    const { id: planTypeId, name: planTypeName } = getPlanType(priceId);
    const isBasicPlan = planTypeId === "basic";
    const isProPlan = planTypeId === "pro";

    // Fetch user's posts
    const userPosts = await sql`SELECT * FROM posts WHERE user_id = ${userId}`;

    // Return the data
    res.status(200).json({
      planTypeName,
      isBasicPlan,
      isProPlan,
      userPosts,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
}
