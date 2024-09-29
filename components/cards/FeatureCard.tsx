import CustomizableCard from "./CustomizableCard";
import { Feature } from "@/types/idea";

type FeatureCardProps = {
  className?: string;
  feature: Feature;
  selected?: boolean;
  onClick?: () => void;
};

export default function FeatureCard({
  className = "",
  feature,
  selected = false,
  onClick,
}: FeatureCardProps) {
  return (
    <CustomizableCard
      className={className}
      title={feature.title}
      description={feature.userStory}
      selected={selected}
      onSelect={onClick}
      renderContent={() => (
        <div>
          Acceptance Criteria
          <ul className="text-muted-foreground">
            {feature.acceptanceCriteria.map((criteria, i) => (
              <li key={i}>{criteria}</li>
            ))}
          </ul>
        </div>
      )}
    />
  );
}
