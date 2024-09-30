import CustomizableCard from "./CustomizableCard";
import { Framework } from "@/types/idea";
import { toAlphaLowerCase } from "@/lib/utils";
import tools from "@/app/idea/data/tools";
import { useForm } from "react-hook-form";
import FormInput from "@/components/FormInput";
import { Form } from "../ui/form";

type FrameworkCardProps = {
  className?: string;
  framework: Framework;
  selected?: boolean;
  onClick?: () => void;
};

export default function FrameworkCard({
  className = "",
  framework,
  selected = false,
  onClick,
}: FrameworkCardProps) {
  const form = useForm({
    defaultValues: {
      title: framework.title,
      description: framework.description,
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
  };

  const title = form.watch("title");
  const description = form.watch("description");

  return (
    <CustomizableCard
      className={className}
      title={title}
      description={
        <span>
          {description.split(" ").map((word, j) => {
            const tool = framework.tools.find(
              (tool) => toAlphaLowerCase(tool) === toAlphaLowerCase(word),
            );
            if (tool && tools.includes(tool)) {
              const punctuation = word.match(/[^a-zA-Z0-9]+$/)?.[0] || "";
              return (
                <span key={`tool-${j}`} className="font-semibold">
                  {punctuation ? word.slice(0, -punctuation.length) : word}
                  <i
                    className={`ml-2 devicon-${tool}-original ml-2 devicon-${tool}-plain colored`}
                  ></i>
                  {punctuation + " "}
                </span>
              );
            }
            return word + " ";
          })}
        </span>
      }
      selected={selected}
      onSelect={onClick}
      renderEditForm={() => (
        <Form {...form}>
          <form>
            <FormInput
              form={form}
              name="title"
              label="Title"
              placeholder="Enter title"
            />
            <FormInput
              form={form}
              name="description"
              label="Description"
              placeholder="Enter description"
            />
          </form>
        </Form>
      )}
      onSubmit={form.handleSubmit(onSubmit)}
    />
  );
}
