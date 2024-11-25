import { LogIn } from "lucide-react";
import { signIn } from "next-auth/react";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";

interface SignInAlertProps {
  className?: string;
  description?: string;
  mode?: "alert" | "bare";
}

const SignInAlert = ({
  className,
  description,
  mode = "alert",
}: SignInAlertProps) => {
  const content = (
    <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
      {description && <span>{description}</span>}
      <Button
        variant="secondary"
        size="sm"
        type="button"
        onClick={() => signIn("github")}
      >
        <LogIn className="mr-2 h-3 w-3" />
        Sign in
      </Button>
    </div>
  );

  if (mode === "bare") {
    return <div className={`${className}`}>{content}</div>;
  }

  return (
    <Alert className={`${className}`}>
      <AlertDescription>{content}</AlertDescription>
    </Alert>
  );
};

export default SignInAlert;
