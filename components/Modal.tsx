import React, { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ModalProps {
  title: string;
  description?: string;
  renderTrigger: (props: { open: () => void }) => React.ReactNode;
  children?: ReactNode;
  onSubmit: () => void;
  actionText?: string;
}

export function Modal({
  title,
  description,
  renderTrigger,
  children,
  onSubmit,
  actionText = "Continue",
}: ModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {renderTrigger({ open: () => {} })}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
          {children}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onSubmit}>{actionText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
