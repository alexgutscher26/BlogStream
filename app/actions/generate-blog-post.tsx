import { publishToWordPress } from "@/lib/wordpress";
import getDbConnection from "@/lib/db";
import { revalidatePath } from "next/cache"; // Assuming this is from Next.js
import { redirect } from "next/navigation"; // Assuming this is from Next.js

// Function to handle blog post generation and WordPress publishing
export async function generateBlogPostAction({
  transcriptions,
  userId,
}: {
  transcriptions: { text: string };
  userId: string;
}) {
  // Fetch recent user posts from the database
  const userPosts = await getUserBlogPosts(userId);
  let postId = null;

  if (transcriptions) {
    // Generate blog post content from transcriptions
    const blogPost = await generateBlogPost({
      transcriptions: transcriptions.text,
      userPosts,
    });

    if (!blogPost) {
      throw new Error("Blog post generation failed");
    }

    const [title, ...contentParts] = blogPost.split("\n\n");
    const content = contentParts.join("\n\n");

    // Save the blog post to the database
    postId = await saveBlogPost(userId, title, content);

    // Fetch the user's WordPress credentials from the database
    const sql = await getDbConnection();
    const [user] = await sql`
      SELECT wordpress_site_url, wordpress_username, wordpress_application_password 
      FROM wordpress_credentials 
      WHERE user_id = ${userId};
    `;

    if (user && user.wordpress_site_url) {
      // Auto-publish the post to WordPress using the credentials
      try {
        await publishToWordPress({
          title,
          content,
          siteUrl: user.wordpress_site_url,
          username: user.wordpress_username,
          applicationPassword: user.wordpress_application_password,
        });

        console.log("Successfully published to WordPress!");
      } catch (error) {
        console.error("Failed to publish to WordPress:", error);
      }
    } else {
      console.log("No WordPress credentials found for user:", userId);
    }
  } else {
    throw new Error("No transcriptions provided");
  }

  // Revalidate and redirect to the post page
  await revalidatePath(`/posts/${postId}`);
  redirect(`/posts/${postId}`);
}

// Dummy implementation of missing functions, replace with real implementations
async function getUserBlogPosts(userId: string): Promise<string[]> {
  // Fetch and return the user's previous blog posts (as an array of content strings)
  return [];
}

async function generateBlogPost({
  transcriptions,
  userPosts,
}: {
  transcriptions: string;
  userPosts: string[];
}): Promise<string> {
  // Generate and return the blog post content
  return `# Blog Post Title\n\nThis is the generated blog post.\n\n${transcriptions}`;
}

async function saveBlogPost(
  userId: string,
  title: string,
  content: string
): Promise<string> {
  // Save the blog post to the database and return the post ID
  const sql = await getDbConnection();
  const [post] = await sql`
    INSERT INTO posts (user_id, title, content)
    VALUES (${userId}, ${title}, ${content})
    RETURNING id;
  `;
  return post.id;
}
