"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const heroAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const heroButtonsAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const Hero = () => {
  // Title typing animation
  const fullText = "what to code";
  const [text, setText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (text.length < fullText.length) {
      const timeout = setTimeout(() => {
        setText(fullText.slice(0, text.length + 1));
      }, 150); // Slightly slower typing speed

      return () => clearTimeout(timeout);
    } else {
      setIsTypingComplete(true);
    }
  }, [text]);

  return (
    <motion.section
      className="container w-full"
      initial="hidden"
      animate="visible"
      variants={heroAnimation}
    >
      <div className="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto pb-20 md:pb-32 pt-16 md:pt-24 lg:pt-20">
        <motion.div
          className="text-center space-y-8"
          variants={heroButtonsAnimation}
        >
          <div className="max-w-screen-md lg:max-w-screen-lg mx-auto text-center text-5xl md:text-6xl lg:text-7xl font-bold">
            stop getting stuck on
            <br />
            <motion.div
              className="text-transparent inline-block px-2 bg-gradient-to-r from-[#3fb65b] to-primary bg-clip-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <span className="mr-1">{text}</span>
              <AnimatePresence>
                {!isTypingComplete && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    className="inline-block w-[3px] h-[1em] bg-primary align-middle"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <motion.p
            className="max-w-screen-md mx-auto text-xl text-muted-foreground"
            variants={heroButtonsAnimation}
          >
            generate new ideas for your next software project, <b>fast</b>, and
            kickstart your GitHub repository with just a few clicks
          </motion.p>

          <motion.div
            className="space-y-4 md:space-y-0 md:space-x-4"
            variants={heroButtonsAnimation}
          >
            <Button asChild className="w-5/6 md:w-1/4 group/arrow">
              <Link href="/idea/generate">
                get started
                <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="secondary" className="w-5/6 md:w-1/4 ">
              <Link href="/project">explore projects</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
      <motion.hr
        className="w-11/12 mx-auto"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      />
    </motion.section>
  );
};
