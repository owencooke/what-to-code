import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Footer() {
  return (
    <div className="flex text-sm justify-center items-center px-8 py-4 border-t">
      <div>
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
