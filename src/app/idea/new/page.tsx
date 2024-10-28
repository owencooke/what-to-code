"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ky from "ky";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { PlusCircle, MinusCircle } from "lucide-react";
import { PartialIdea, PartialIdeaSchema } from "@/types/idea";
import FormInput from "@/components/FormInput";

const formSchema = PartialIdeaSchema.omit({ likes: true, id: true }).extend({
  description: PartialIdeaSchema.shape.description.min(10, {
    message: "Description must be at least 10 characters.",
  }),
});
type FormValues = z.infer<typeof formSchema>;

export default function CreateIdea() {
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
      console.error("Error creating idea:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-2">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Already have an idea in mind?</CardTitle>
          <CardDescription className="pt-2">
            Tell us more about it so our AI dev team can help you get started 🚀
          </CardDescription>
        </CardHeader>
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

              <div className="space-y-2">
                <FormLabel className="block mb-1">
                  Features (Optional)
                </FormLabel>
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`features.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Input
                              placeholder="Short description of a feature"
                              {...field}
                              value={field.value || ""}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => remove(index)}
                            >
                              <MinusCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ title: "" })}
                  className="mt-2"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Idea"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
