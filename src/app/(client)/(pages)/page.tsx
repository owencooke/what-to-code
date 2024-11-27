"use client";

import { Hero } from "@/app/(client)/components/landing/Hero";
import { HowItWorks } from "@/app/(client)/components/landing/HowItWorks";
import { Newsletter } from "@/app/(client)/components/landing/Newsletter";
import { ScrollToTop } from "@/app/(client)/components/landing/ScrollToTop";

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
