import CustomizableCard from "./CustomizableCard";
import { Framework } from "@/types/project";
import { toAlphaLowerCase } from "@/app/(server)/lib/utils";
import { TOOLS } from "@/app/(server)/lib/constants/tools";
import { useForm } from "react-hook-form";
import FormInput from "@/components/FormInput";
import { useEffect } from "react";

type FrameworkCardProps = {
  className?: string;
  framework: Framework;
  selected?: boolean;
  onClick?: () => void;
  onSubmit?: (framework: Framework) => void;
};

export default function FrameworkCard({
  className = "",
  framework,
  selected = false,
  onClick,
  onSubmit = () => {},
}: FrameworkCardProps) {
  const form = useForm({
    defaultValues: {
      title: framework.title,
      description: framework.description,
    },
  });

  useEffect(() => {
    form.reset({ ...framework });
  }, [framework, form]);

  const handleSubmit = () => {
    const data = form.getValues();
    onSubmit({
      ...framework,
      title: data.title,
      description: data.description,
    });
  };

  return (
    <CustomizableCard
      className={className}
      title={framework.title}
      description={
        <span>
          {framework.description.split(" ").map((word, j) => {
            const tool = framework.tools.find(
              (tool) => toAlphaLowerCase(tool) === toAlphaLowerCase(word),
            );
            if (tool && TOOLS.includes(tool)) {
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
      form={form}
      onSubmitForm={handleSubmit}
      renderEditFormFields={
        onClick
          ? () => (
              <>
                <FormInput
                  form={form}
                  name="title"
                  label="Title"
                  placeholder="What kind of software?"
                />
                <FormInput
                  className="h-[10rem]"
                  form={form}
                  name="description"
                  label="Description"
                  type="area"
                  placeholder="How is it being built?"
                />
              </>
            )
          : undefined
      }
    />
  );
}
