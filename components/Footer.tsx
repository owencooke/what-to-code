import Waitlist from "./Waitlist";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Footer() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center px-8 py-4 border-t">
      <div className="text-sm">
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
      <div className="flex flex-col md:flex-row items-center gap-2 text-sm">
        <span>{"be the first to know what's new"}</span>
        <Waitlist />
      </div>
    </div>
  );
}
