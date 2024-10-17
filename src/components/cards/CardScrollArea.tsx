import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CardScrollAreaProps {
  children: React.ReactNode;
}

const CardScrollArea: React.FC<CardScrollAreaProps> = ({ children }) => {
  return (
    <ScrollArea className="w-full">
      <div className="flex gap-8 mb-6">{children}</div>
      <ScrollBar orientation="horizontal" forceMount />
    </ScrollArea>
  );
};

export default CardScrollArea;
