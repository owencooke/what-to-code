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
import { UseFormReturn } from "react-hook-form";

interface ModalProps {
  title: string;
  description?: string;
  renderTrigger: (props: { open: () => void }) => React.ReactNode;
  children?: ReactNode;
  form?: UseFormReturn<any, any, any>;
  onSubmit: (data: any) => void;
  actionText?: string;
}

export function Modal({
  title,
  description = "",
  renderTrigger,
  children,
  form,
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
          <AlertDialogCancel>
            <div onClick={() => form?.reset()}>Cancel</div>
          </AlertDialogCancel>
          <AlertDialogAction>
            <div onClick={onSubmit}>{actionText}</div>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
