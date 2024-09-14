export const plansMap = [
  {
    id: "basic",
    name: "Basic",
    description: "Get started with SpeakEasy!",
    price: "9.99",
    items: ["3 Blog Posts", "3 Transcription"],
    paymentLink: "https://buy.stripe.com/test_9AQ9AQ8aW7b678k4gg",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1PxImr00a4PHLBhaIbki9Onh"
        : "",
  },
  {
    id: "pro",
    name: "Pro",
    description: "All Blog Posts, let’s go!",
    price: "19.99",
    items: ["Unlimited Blog Posts", "Unlimited Transcriptions"],
    paymentLink: "https://buy.stripe.com/test_bIY9AQbn83YU0JWfYZ",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1PxIn800a4PHLBha5rCYkNHW"
        : "",
  },
];

export const ORIGIN_URL =
  process.env.NODE_ENV === "development"
    ? "https://blog-stream-ten.vercel.app"
    : "http://localhost:3000";

