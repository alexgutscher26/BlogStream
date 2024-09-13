"use server";

import getDbConnection from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function saveWordPressCredentials({
  siteUrl,
  username,
  applicationPassword,
}: {
  siteUrl: string;
  username: string;
  applicationPassword: string;
}) {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const sql = await getDbConnection();

    // Log the user data and SQL values for debugging
    // console.log("Saving WordPress credentials for User ID:", user.id);

    // Use INSERT ... ON CONFLICT to either insert a new row or update the existing one
    await sql`
      INSERT INTO wordpress_credentials (user_id, wordpress_site_url, wordpress_username, wordpress_application_password)
      VALUES (${user.id}, ${siteUrl}, ${username}, ${applicationPassword})
      ON CONFLICT (user_id)
      DO UPDATE SET 
        wordpress_site_url = EXCLUDED.wordpress_site_url,
        wordpress_username = EXCLUDED.wordpress_username,
        wordpress_application_password = EXCLUDED.wordpress_application_password;
    `;

    

    return { success: true };
  } catch (error) {
    console.error("Failed to save WordPress credentials:", error);
    throw new Error("Failed to save WordPress credentials");
  }
}
