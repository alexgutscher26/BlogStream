import fetch from "node-fetch";

interface WordPressPublishParams {
  title: string;
  content: string;
  siteUrl: string;
  username: string;
  applicationPassword: string;
}

export async function publishToWordPress({
  title,
  content,
  siteUrl,
  username,
  applicationPassword,
}: WordPressPublishParams): Promise<any> {
  try {
    const response = await fetch(`${siteUrl}/wp-json/wp/v2/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${username}:${applicationPassword}`
        ).toString("base64")}`,
      },
      body: JSON.stringify({
        title, 
        content,
        status: "publish", // Change to "draft" if you don't want to publish immediately
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Failed to publish to WordPress: ${data.message}`);
    }

    console.log("Successfully published to WordPress:", data);
    return data;
  } catch (error) {
    console.error("Error publishing to WordPress:", error);
    throw error;
  }
}
