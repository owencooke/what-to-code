import { create } from "zustand";
import { PartialIdea, Feature, Framework } from "@/types/idea";

interface CreateProjectState {
  // state
  idea: PartialIdea | null;
  features: Feature[];
  frameworks: Framework[];

  // actions
  setIdea: (idea: PartialIdea) => void;
  setFeatures: (features: Feature[]) => void;
  setFrameworks: (frameworks: Framework[]) => void;
}

export const useCreateProjectStore = create<CreateProjectState>((set) => ({
  idea: null,
  features: [],
  frameworks: [],
  setIdea: (idea) => set({ idea }),
  setFeatures: (features) => set({ features }),
  setFrameworks: (frameworks) => set({ frameworks }),
  setFeature: (feature: Feature) =>
    set((state) => ({
      features: state.features.map((f) => (f.id === feature.id ? feature : f)),
    })),
  setFramework: (framework: Framework) =>
    set((state) => ({
      frameworks: state.frameworks.map((f) =>
        f.id === framework.id ? framework : f,
      ),
    })),
}));
