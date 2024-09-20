"use client";

import Footer from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Navbar } from "@/components/landing/Navbar";
import { Newsletter } from "@/components/landing/Newsletter";
import { ScrollToTop } from "@/components/landing/ScrollToTop";

function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Newsletter />
      <Footer />
      <ScrollToTop />
    </>
  );
}

export default LandingPage;
