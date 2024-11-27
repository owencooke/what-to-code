import { Skeleton } from "@/app/(client)/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="min-h-[12rem] min-w-[24rem] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}
