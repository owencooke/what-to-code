import { ReactNode } from "react";
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

type SelectableCardProps = {
  className?: string;
  title: string;
  description: ReactNode;
  selected?: boolean;
  onSelect?: () => void;
  onSubmit?: () => void;
  renderContent?: () => ReactNode;
  renderFooter?: () => ReactNode;
  renderEditForm?: () => ReactNode;
};

export default function CustomizableCard({
  className = "",
  title,
  description,
  selected = false,
  onSelect,
  onSubmit,
  renderContent,
  renderFooter,
  renderEditForm,
}: SelectableCardProps) {
  const handleClick = () => {
    if (isSelectable) {
      onSelect && onSelect();
    }
  };

  const isEditable = !!renderEditForm;
  const isSelectable = !!onSelect;

  return (
    <>
      <Card
        className={`min-w-[19.25rem] text-sm ${className} ${
          selected ? "[border-color:var(--accent)]" : ""
        } ${isSelectable ? "cursor-pointer" : ""}`}
        onClick={handleClick}
      >
        <CardHeader>
          <CardTitle className="flex justify-between items-start gap-2">
            {title}
            {isEditable && (
              <Modal
                title={`Edit ${title}`}
                renderTrigger={() => (
                  <Button
                    type="button"
                    className="flex-shrink-0 flex-grow-0 w-9 h-9"
                    size="icon"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                onSubmit={onSubmit || (() => {})}
              >
                {renderEditForm && renderEditForm()}
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
