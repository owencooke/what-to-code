import React from "react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormInputProps {
  className?: string;
  type?: "input" | "area" | ((field: ControllerRenderProps) => React.ReactNode);
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  maxLength?: number;
}

const FormInput: React.FC<FormInputProps> = ({
  className,
  type = "input",
  form,
  name,
  label,
  placeholder,
  description,
  maxLength,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel className="font-semibold text-md">{label}</FormLabel>
          )}
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>
            {typeof type === "function" ? (
              type(field)
            ) : type === "input" ? (
              <Input
                className={className}
                placeholder={placeholder}
                maxLength={maxLength}
                {...field}
              />
            ) : (
              <Textarea
                className={className}
                placeholder={placeholder}
                maxLength={maxLength}
                {...field}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;