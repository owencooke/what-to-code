"use client";

import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Newsletter } from "@/components/landing/Newsletter";
import { ScrollToTop } from "@/components/landing/ScrollToTop";

function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Newsletter />
      <ScrollToTop />
    </>
  );
}

export default LandingPage;
