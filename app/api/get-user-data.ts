// /pages/api/get-user-data.ts
import { NextApiRequest, NextApiResponse } from "next";
import getDbConnection from "@/lib/db";
import { getPlanType, doesUserExist, updateUser } from "@/lib/user-helpers";
import { currentUser } from "@clerk/nextjs/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await currentUser();

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const sql = await getDbConnection();
    const email = user.emailAddresses?.[0]?.emailAddress ?? "";

    const dbUser = await doesUserExist(sql, email);
    if (!dbUser) {
      return res.status(404).json({ message: "User does not exist in the database" });
    }

    const userId = user.id;
    await updateUser(sql, userId, email);

    const priceId = dbUser[0]?.price_id;
    const { id: planTypeId, name: planTypeName } = getPlanType(priceId);
    const isBasicPlan = planTypeId === "basic";
    const isProPlan = planTypeId === "pro";

    const userPosts = await sql`SELECT * FROM posts WHERE user_id = ${userId}`;

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
