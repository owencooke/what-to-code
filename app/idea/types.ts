type Feature = {
  title: string;
  userStory: string;
  acceptanceCriteria: string[];
};

type Framework = {
  title: string;
  description: string;
  tools: string[];
};

type Idea = {
  title: string;
  description: string;
  features?: Feature[];
  frameworks?: Framework[];
};

export type { Idea, Feature, Framework };
