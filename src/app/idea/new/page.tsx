"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ky from "ky";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Plus, X } from "lucide-react";
import { PartialIdea, PartialIdeaSchema } from "@/types/idea";
import FormInput from "@/components/FormInput";
import { useToast } from "@/components/ui/use-toast";

const formSchema = PartialIdeaSchema.omit({ likes: true, id: true }).extend({
  description: PartialIdeaSchema.shape.description.min(10, {
    message: "Description must be at least 10 characters.",
  }),
});
type FormValues = z.infer<typeof formSchema>;

const MotionCard = motion(Card);
const MotionInput = motion(Input);
const MotionButton = motion(Button);

export default function CreateIdea() {
  const { toast } = useToast();
  const router = useRouter();
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
        .json<{ idea: PartialIdea }>();
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

  const handleRemove = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove],
  );

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
          <CardDescription className="pt-2">
            Tell us more about it so our AI dev team can help you get started 🚀
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <FormInput
                  form={form}
                  name="title"
                  placeholder="Summarize your idea in a few words"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <FormInput
                  form={form}
                  name="description"
                  placeholder="Describe your idea in detail"
                  type="area"
                  className="max-h-32"
                />
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex justify-between items-center mb-1">
                  <FormLabel>Features</FormLabel>
                  <MotionButton
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => append({ title: "" })}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="h-4 w-4" />
                  </MotionButton>
                </div>
                <AnimatePresence initial={false}>
                  {fields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FormField
                        control={form.control}
                        name={`features.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <MotionInput
                                  placeholder="Title of a feature"
                                  {...field}
                                  value={field.value || ""}
                                  whileHover={{ scale: 1.02 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                  }}
                                />
                                <MotionButton
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleRemove(index)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <X className="h-4 w-4" />
                                </MotionButton>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </CardContent>
            <CardFooter>
              <MotionButton
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isSubmitting ? { scale: [1, 1.05, 1] } : {}}
                transition={{
                  duration: 0.5,
                  repeat: isSubmitting ? Infinity : 0,
                }}
              >
                {isSubmitting ? "getting ready..." : "expand my idea"}
              </MotionButton>
            </CardFooter>
          </form>
        </Form>
      </MotionCard>
    </div>
  );
}
