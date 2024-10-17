import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/FormInput";

const FormSchema = z.object({
  email: z.string().email(),
});

export default function Waitlist() {
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
    } else {
      toast({
        title: "Email subscription signup failed.",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex items-center justify-center gap-2"
      >
        <FormInput
          className="w-fit"
          form={form}
          name="email"
          placeholder="someone@example.com"
        />
        <Button type="submit">Sign Up</Button>
      </form>
    </Form>
  );
}
