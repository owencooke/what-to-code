import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useEffect } from "react";
import FormInput from "@/components/FormInput";

const FormSchema = z.object({
  email: z.string().email(),
});

export const Newsletter = () => {
  const FormSchema = z.object({
    email: z.string().email(),
  });

  const { data: session } = useSession();
  const { toast } = useToast();

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

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    const response = await fetch(`/api/subscribe?email=${data.email}`, {
      method: "POST",
    });
    if (response.ok) {
      toast({
        title: "Thanks for subscribing 💌",
        description: "We've got your email. Stay tuned for updates!",
      });
      form.reset();
    } else {
      toast({
        title: "Email subscription signup failed.",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="newsletter">
      <hr className="w-11/12 mx-auto" />

      <div className="container py-24 sm:py-32">
        <h3 className="text-center text-4xl md:text-5xl font-bold">
          Join Our Daily{" "}
          <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            Newsletter
          </span>
        </h3>
        <p className="text-xl text-muted-foreground text-center mt-4 mb-8">
          Lorem ipsum dolor sit amet consectetur.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col justify-center w-full md:flex-row md:w-6/12 lg:w-4/12 mx-auto gap-4 md:gap-2"
          >
            <FormInput
              className="bg-muted/50 dark:bg-muted/80"
              form={form}
              name="email"
              placeholder="someone@example.com"
            />
            <Button type="submit">Sign Up</Button>
          </form>
        </Form>
      </div>

      <hr className="w-11/12 mx-auto" />
    </section>
  );
};
