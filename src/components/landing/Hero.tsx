import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="container w-full">
      <div className="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto pb-20 md:pb-32 pt-16 md:pt-24 lg:pt-20">
        <div className="text-center space-y-8">
          <div className="max-w-screen-md lg:max-w-screen-lg mx-auto text-center text-5xl md:text-6xl lg:text-7xl font-bold">
            stop getting stuck on
            <br />
            <span className="text-transparent px-2 bg-gradient-to-r from-[#3fb65b] to-primary bg-clip-text">
              what to code
            </span>
          </div>

          <p className="max-w-screen-md mx-auto text-xl text-muted-foreground">
            generate new ideas for your next software project, <b>fast</b>, and
            kickstart your GitHub repository with just a few clicks
          </p>

          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Button asChild className="w-5/6 md:w-1/4 group/arrow">
              <Link href="/idea">
                get started
                <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="secondary" className="w-5/6 md:w-1/4 ">
              <Link href="/explore">explore projects</Link>
            </Button>
          </div>
        </div>
      </div>
      <hr className="w-11/12 mx-auto" />
    </section>
  );
};
