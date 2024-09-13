import WordPressSettingsForm from "@/components/settings/WordPressSettingsForm";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6 shadow-lg rounded-lg">
      <h1 className="text-4xl font-extrabold  mb-6 text-center">
        CMS Settings
      </h1>
      <p className="mb-8 text-lg text-center">
        Connect your WordPress account to auto-publish blog posts.
      </p>

      <WordPressSettingsForm />
    </div>
  );
}
