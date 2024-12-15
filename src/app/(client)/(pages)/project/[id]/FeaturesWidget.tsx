"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/app/(client)/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/app/(client)/components/ui/accordion";
import { Feature } from "@/types/project";

export default function FeaturesWidget({
  features,
}: {
  features: Omit<Feature, "id">[];
}) {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  return (
    <Card className="h-full">
      <CardHeader>
        <h2 className="text-xl font-semibold">Features</h2>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          {features.map((feature, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger
                onClick={() =>
                  setExpandedFeature(
                    expandedFeature === `item-${index}`
                      ? null
                      : `item-${index}`,
                  )
                }
              >
                {feature.title}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-4">
                  {feature.acceptanceCriteria.map((criteria, idx) => (
                    <li key={idx}>{criteria}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
