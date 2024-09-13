import { NextSeo, ArticleJsonLd } from "next-seo";
import ContentEditor from "@/components/content/content-editor";
import getDbConnection from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Internal Linking Function
function addInternalLinks(content: string, keywords: { [key: string]: string }): string {
  let updatedContent = content;
  for (const keyword in keywords) {
    const link = `<a href="${keywords[keyword]}" class="text-blue-600 hover:underline">${keyword}</a>`;
    updatedContent = updatedContent.replace(new RegExp(`\\b${keyword}\\b`, 'gi'), link);
  }
  return updatedContent;
}

const keywordsMap = {
  'Next.js': '/posts/nextjs-guide',
  'SEO': '/posts/seo-guide',
  'React': '/posts/react-tutorial',
  // Add more keywords and URLs as needed
};

export default async function PostsPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const user = await currentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const sql = await getDbConnection();

  const posts: any = await sql`SELECT * from posts where user_id = ${user.id} and id = ${id}`;

  const post = posts[0];

  const seoTitle = post.title || "Your Blog Post Title";
  const seoDescription = post.content.slice(0, 160);
  const seoImage = post.thumbnail_url || "/default-thumbnail.jpg";

  // Apply internal linking to the blog post content
  const postContentWithLinks = addInternalLinks(post.content, keywordsMap);

  return (
    <div className="mx-auto w-full max-w-screen-xl px-2.5 lg:px-0 mb-12 mt-28">
      {/* SEO Metadata */}
      <NextSeo
        title={seoTitle}
        description={seoDescription}
        canonical={`https://your-site.com/posts/${post.id}`}
        openGraph={{
          title: seoTitle,
          description: seoDescription,
          images: [
            {
              url: seoImage,
              alt: seoTitle,
            },
          ],
          type: 'article',
        }}
      />
      {/* JSON-LD Structured Data */}
      <ArticleJsonLd
        url={`https://your-site.com/posts/${post.id}`}
        title={seoTitle}
        images={[seoImage]}
        datePublished={post.created_at}
        dateModified={post.updated_at}
        authorName={user.username} // Assuming 'username' is the correct property based on the context
        publisherName="Your Site Name"
        description={seoDescription}
      />

      {/* Render blog post with internal links */}
      <ContentEditor posts={[{ ...post, content: postContentWithLinks }]} />
    </div>
  );
}
