// /pages/api/submit-post.ts
import { currentUser } from '@clerk/nextjs/server';
import getDbConnection from "@/lib/db";
import { z } from 'zod';

const postSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
});

export default async function handler(req: { body: unknown; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; error?: any; }): void; new(): any; }; }; }) {
  const user = await currentUser();

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Validate and sanitize input
    const validatedData = postSchema.parse(req.body);

    const sql = await getDbConnection();
    await sql`INSERT INTO posts (user_id, title, content) VALUES (${user.id}, ${validatedData.title}, ${validatedData.content})`;

    res.status(200).json({ message: "Post created successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Invalid input", error: (error as Error).message });
  }
}
