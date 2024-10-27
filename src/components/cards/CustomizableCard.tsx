import { ReactNode, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Modal } from "@/components/Modal";
import { UseFormReturn } from "react-hook-form";
import { Form } from "../ui/form";
import { useTheme } from "@/components/providers/theme-provider";

type SelectableCardProps = {
  className?: string;
  title: string;
  description: ReactNode;
  selected?: boolean;
  onSelect?: () => void;
  renderContent?: () => ReactNode;
  renderFooter?: () => ReactNode;
  form?: UseFormReturn<any, any, any>;
  renderEditFormFields?: () => ReactNode;
  onSubmitForm?: (data: any) => void;
};

export default function CustomizableCard({
  className = "",
  title,
  description,
  selected = false,
  onSelect,
  renderContent,
  renderFooter,
  form,
  renderEditFormFields,
  onSubmitForm,
}: SelectableCardProps) {
  const handleClick = () => {
    if (isSelectable) {
      onSelect && onSelect();
    }
  };

  const isEditable = form && !!onSubmitForm && !!renderEditFormFields;
  const isSelectable = useMemo(() => !!onSelect, [onSelect]);

  return (
    <>
      <Card
        className={`min-w-[19.25rem] bg-inherit border-none relative text-sm ${className} ${
          selected ? "[border-color:var(--accent)]" : ""
        } ${isSelectable ? "cursor-pointer" : ""}`}
        onClick={handleClick}
      >
        <div className="absolute inset-0 bg-black dark:bg-white opacity-5 pointer-events-none rounded-lg"></div>
        <CardHeader>
          <CardTitle className="flex justify-between items-start gap-2">
            {title}
            {isEditable && (
              <Modal
                title="Edit Card"
                renderTrigger={() => (
                  <Button
                    type="button"
                    className="flex-shrink-0 flex-grow-0 w-9 h-9"
                    size="icon"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                form={form}
                onSubmit={onSubmitForm}
                actionText="Save"
              >
                {
                  <Form {...form}>
                    <form className="flex flex-col gap-4 text-left">
                      {renderEditFormFields()}
                    </form>
                  </Form>
                }
              </Modal>
            )}
          </CardTitle>
          <CardDescription className="!mt-4">{description}</CardDescription>
        </CardHeader>
        <CardContent>{renderContent && renderContent()}</CardContent>
        {renderFooter && <CardFooter>{renderFooter()}</CardFooter>}
      </Card>
    </>
  );
}
