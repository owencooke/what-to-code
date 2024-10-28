"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import FormInput from "@/components/FormInput";
import { motion, useAnimation, useInView } from "framer-motion";
import ky from "ky";

const containerAnimation = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const childAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const formAnimation = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const FormSchema = z.object({
  email: z.string().email(),
});

export const Newsletter = () => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (session?.user?.email) {
      form.setValue("email", session.user.email);
    }
  }, [session, form]);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await ky.post("/api/subscribe", {
        json: { email: data.email },
      });

      if (response.ok) {
        toast({
          title: "Thanks for subscribing 💌",
          description: "We've got your email. Stay tuned for updates!",
        });
        form.reset();
        setSubmitted(true);
      }
    } catch (error) {
      toast({
        title: "Email subscription signup failed.",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.section
      id="newsletter"
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerAnimation}
    >
      <motion.hr className="w-11/12 mx-auto" variants={childAnimation} />

      <div className="container pt-24 sm:pt-32 pb-20">
        <motion.h3
          className="text-center text-4xl md:text-5xl font-bold"
          variants={childAnimation}
        >
          Join Our{" "}
          <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            Newsletter
          </span>
        </motion.h3>
        <motion.p
          className="text-xl text-muted-foreground text-center mt-4 mb-8"
          variants={childAnimation}
        >
          {`be the first to know about new and exciting features`}
        </motion.p>

        <motion.div variants={formAnimation}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col justify-center w-full md:flex-row md:w-6/12 lg:w-4/12 mx-auto gap-4 md:gap-2"
            >
              <FormInput
                className="bg-muted/50 dark:bg-muted/80"
                form={form}
                name="email"
                label={null}
                placeholder="someone@example.com"
              />
              <Button type="submit">Sign Up</Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </motion.section>
  );
};
