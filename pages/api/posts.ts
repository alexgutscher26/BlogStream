// /pages/api/posts.ts
import { currentUser } from '@clerk/nextjs/server'; // Or use your own auth method
import getDbConnection from "@/lib/db";

export default async function handler(req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: Record<string, any>[]): any; new(): any; }; }; }) {
  const user = await currentUser();

  // Check if the user is authenticated
  if (!user) {
    return res.status(401).json([{ error: "Unauthorized" }]);
  }

  // Example: Only allow access if the user is the owner of the posts
  const sql = await getDbConnection();
  const posts = await sql`SELECT * FROM posts WHERE user_id = ${user.id}`;

  return res.status(200).json(posts);
}
