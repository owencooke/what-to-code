"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ky from "ky";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/(client)/components/ui/button";
import { Input } from "@/app/(client)/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/app/(client)/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/(client)/components/ui/form";
import { Plus, X } from "lucide-react";
import { Idea, IdeaSchema } from "@/types/idea";
import FormInput from "@/app/(client)/components/FormInput";
import { useToast } from "@/app/(client)/components/ui/use-toast";
import { useSession } from "next-auth/react";
import SignInAlert from "@/app/(client)/components/SignInAlert";

const formSchema = IdeaSchema.omit({ likes: true, id: true }).extend({
  description: IdeaSchema.shape.description.min(10, {
    message: "Description must be at least 10 characters.",
  }),
  features: z.array(
    z.object({ title: z.string().min(1, "Feature title is required") }),
  ),
});

type FormValues = z.infer<typeof formSchema>;

const MotionCard = motion(Card);
const MotionInput = motion(Input);
const MotionButton = motion(Button);

export default function CreateIdea() {
  const { toast } = useToast();
  const router = useRouter();
  const { data: session } = useSession();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      features: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await ky
        .post("/api/idea", { json: data })
        .json<{ idea: Idea }>();
      router.push(`/idea/expand/${response.idea.id}`);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error creating idea:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "There was a problem while creating your idea. Please try again later.",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-2">
      <MotionCard
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CardHeader>
          <CardTitle>Already have an idea?</CardTitle>
          {session?.user ? (
            <CardDescription className="pt-2">
              Tell us more about it so our AI dev team can help you get started
              🚀
            </CardDescription>
          ) : (
            <SignInAlert
              className="w-full"
              mode="bare"
              description="Sign in to expand your idea with help from our AI dev team"
            />
          )}
        </CardHeader>
        {session?.user && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormInput
                  form={form}
                  name="title"
                  placeholder="Summarize your idea in a few words"
                />
                <FormInput
                  form={form}
                  name="description"
                  placeholder="Describe your idea in detail"
                  type="area"
                  className="max-h-32"
                />

                <FormField
                  control={form.control}
                  name="features"
                  render={() => (
                    <FormItem>
                      <FormLabel>Features</FormLabel>
                      <AnimatePresence initial={false}>
                        {fields.map((field, index) => (
                          <motion.div
                            key={field.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <Controller
                                name={`features.${index}.title`}
                                control={form.control}
                                render={({ field }) => (
                                  <MotionInput
                                    {...field}
                                    placeholder={`Title of feature #${index + 1}`}
                                    className="flex-grow"
                                  />
                                )}
                              />
                              <MotionButton
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => remove(index)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <X className="h-4 w-4" />
                              </MotionButton>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      <MotionButton
                        type="button"
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => append({ title: "" })}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add a feature
                      </MotionButton>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <MotionButton
                  type="submit"
                  className="w-full mt-2"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={isSubmitting ? { scale: [1, 1.05, 1] } : {}}
                  transition={{
                    duration: 0.5,
                    repeat: isSubmitting ? Infinity : 0,
                  }}
                >
                  {isSubmitting ? "Getting ready..." : "Expand my idea"}
                </MotionButton>
              </CardFooter>
            </form>
          </Form>
        )}
      </MotionCard>
    </div>
  );
}
