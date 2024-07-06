import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/FormInput";

// Assuming FormSchema is defined elsewhere and includes an email field
const FormSchema = z.object({
  email: z.string().email(),
});

export default function Waitlist() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      // Prefill email from Github login
      email: session?.user?.email || "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    // Handle form submission, e.g., sign up the user with the provided email
    console.log(data);
    toast({
      title: "Signed up successfully.",
      description: "We've received your email.",
    });
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
