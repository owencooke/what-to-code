import { useForm } from "react-hook-form";
import CustomizableCard from "./CustomizableCard";
import { Feature } from "@/types/idea";
import FormInput from "../FormInput";
import { useEffect } from "react";

type FeatureCardProps = {
  className?: string;
  feature: Feature;
  selected?: boolean;
  onClick?: () => void;
  onSubmit?: (feature: Feature) => void;
};

export default function FeatureCard({
  className = "",
  feature,
  selected = false,
  onClick,
  onSubmit = () => {},
}: FeatureCardProps) {
  const form = useForm({
    defaultValues: { ...feature },
  });

  useEffect(() => {
    form.reset({ ...feature });
  }, [feature, form]);

  const handleSubmit = () => onSubmit(form.getValues());

  return (
    <CustomizableCard
      className={className}
      title={feature.title}
      description={feature.userStory}
      selected={selected}
      onSelect={onClick}
      renderContent={() => (
        <div>
          Acceptance Criteria
          <ul className="text-muted-foreground">
            {feature.acceptanceCriteria
              .filter((s) => s)
              .map((criteria, i) => (
                <li key={i}>{criteria}</li>
              ))}
          </ul>
        </div>
      )}
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
                  placeholder="What is being built?"
                />
                <FormInput
                  className="h-[7rem]"
                  form={form}
                  name="userStory"
                  label="User Story"
                  type="area"
                  placeholder="As a <user>, I want <goal>, so that <reason>"
                />
                <div>
                  <span className="font-semibold text-md">
                    Acceptance Criteria
                  </span>
                  <div className="ml-2 flex flex-col gap-2 mt-2">
                    {feature.acceptanceCriteria.map((_, i) => (
                      <FormInput
                        key={i}
                        form={form}
                        type="area"
                        name={`acceptanceCriteria[${i}]`}
                        placeholder="What must the feature do to meet the user's goal?"
                      />
                    ))}
                  </div>
                </div>
              </>
            )
          : undefined
      }
    />
  );
}
