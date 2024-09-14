export const dynamic = 'force-dynamic';

import { BenefitsSection } from "@/components/layout/sections/benefits";
import { CommunitySection } from "@/components/layout/sections/community";
import { ContactSection } from "@/components/layout/sections/contact";
import { FAQSection } from "@/components/layout/sections/faq";
import { FeaturesSection } from "@/components/layout/sections/features";
import { FooterSection } from "@/components/layout/sections/footer";
import { HeroSection } from "@/components/layout/sections/hero";
import { PricingSection } from "@/components/layout/sections/pricing";
import { ServicesSection } from "@/components/layout/sections/services";
import { SponsorsSection } from "@/components/layout/sections/sponsors";
import { TestimonialSection } from "@/components/layout/sections/testimonial";

export const metadata = {
  title: "BlogStream - Streamline video-to-blog",
  description:
    "BlogStream is an innovative SaaS platform that automatically converts your videos into engaging, SEO-optimized blog posts. Using advanced AI, BlogStream transcribes your video content, organizes it into a clear, readable structure, and enhances it with relevant keywords, headings, and formatting.",
  openGraph: {
    type: "website",
    url: "https://blogstream.com",
    title: "BlogStream - Streamline video-to-blog",
    description:
      "BlogStream is an innovative SaaS platform that automatically converts your videos into engaging, SEO-optimized blog posts. Using advanced AI, BlogStream transcribes your video content, organizes it into a clear, readable structure, and enhances it with relevant keywords, headings, and formatting.",
    //    images: [
    //      {
    //        url: "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
    //        width: 1200,
    //        height: 630,
    //        alt: "Shadcn - Landing template",
    //      },
    //    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://blogstream.com",
    title: "BlogStream - Streamline video-to-blog",
    description:
      "BlogStream is an innovative SaaS platform that automatically converts your videos into engaging, SEO-optimized blog posts. Using advanced AI, BlogStream transcribes your video content, organizes it into a clear, readable structure, and enhances it with relevant keywords, headings, and formatting.",
    //    images: [
    //      "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
    //    ],
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <SponsorsSection />
      <BenefitsSection />
      <FeaturesSection />
      <ServicesSection />
      <TestimonialSection />
      <CommunitySection />
      <PricingSection />
      <ContactSection />
      <FAQSection />
      <FooterSection />
    </>
  );
}
