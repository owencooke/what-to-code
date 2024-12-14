import Link from "next/link";
import { buttonVariants } from "@/app/(client)/components/ui/button";

export function Footer() {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center px-8 py-2 border-t bg-muted">
      <div className="text-sm text-center">
        being 🔨 by{" "}
        <Link
          className={`${buttonVariants({ variant: "link" })} !px-0`}
          href="https://github.com/owencooke"
        >
          Owen Cooke
        </Link>{" "}
        and{" "}
        <Link
          className={`${buttonVariants({ variant: "link" })} !px-0`}
          href="https://github.com/zdorward"
        >
          Zack Dorward
        </Link>
      </div>
    </div>
  );
}
