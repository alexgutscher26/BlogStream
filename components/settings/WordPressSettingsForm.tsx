"use client";

import { useState, FormEvent } from "react";
import { saveWordPressCredentials } from "@/app/actions/wordpress-settings";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function WordPressSettingsForm() {
  const [siteUrl, setSiteUrl] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [applicationPassword, setApplicationPassword] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "dirty" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const handleInputChange = (setter: (value: string) => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value);
    if (status === "idle" || status === "success") {
      setStatus("dirty"); // Mark the form as "dirty" if the user changes any input
      setMessage("Changes detected. Please save your changes.");
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("saving"); // Indicate that the form is being saved
    setMessage("Saving...");

    try {
      // Call the server action to save WordPress credentials
      await saveWordPressCredentials({
        siteUrl,
        username,
        applicationPassword,
      });

      setStatus("success"); // Indicate success
      setMessage("Your WordPress credentials have been updated successfully.");
    } catch (error) {
      setStatus("error"); // Indicate an error occurred
      setMessage("Failed to update WordPress credentials. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
          WordPress Settings
        </h2>
        <Input
          id="siteUrl"
          value={siteUrl}
          onChange={handleInputChange(setSiteUrl)} // Handle changes
          placeholder="Your WordPress Site URL"
          required
        />
        <Input
          id="username"
          value={username}
          onChange={handleInputChange(setUsername)} // Handle changes
          placeholder="WordPress Username"
          required
        />
        <Input
          id="applicationPassword"
          type="password"
          value={applicationPassword}
          onChange={handleInputChange(setApplicationPassword)} // Handle changes
          placeholder="WordPress Application Password"
          required
        />
        <Button type="submit" className="w-full" disabled={status === "saving"}>
          {status === "saving" ? "Saving..." : "Save WordPress Credentials"}
        </Button>

        {/* Display inline feedback */}
        {status === "dirty" && (
          <p className="text-yellow-600 text-center mt-4">{message}</p>
        )}
        {status === "success" && (
          <p className="text-green-600 text-center mt-4">✅ {message}</p>
        )}
        {status === "error" && (
          <p className="text-red-600 text-center mt-4">{message}</p>
        )}
      </form>
    </div>
  );
}
