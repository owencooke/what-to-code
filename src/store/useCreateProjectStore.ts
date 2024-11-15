import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { PartialIdea, Feature, Framework } from "@/types/idea";

interface CreateProjectState {
  // state
  idea: PartialIdea | null;
  features: Feature[];
  frameworks: Framework[];
  selectedFeatureIds: number[];
  selectedFrameworkId: number;
  starterRepo: string | null;

  // actions
  setIdea: (idea: PartialIdea) => void;
  setFeatures: (features: Feature[]) => void;
  setFrameworks: (frameworks: Framework[]) => void;
  setFeature: (feature: Feature) => void;
  setFramework: (framework: Framework) => void;
  setStarterRepo: (url: string | null) => void;
  resetState: () => void;

  // helpers
  getSelectedFeatures: () => Feature[];
  getSelectedFramework: () => Framework | undefined;
}

// Define initial state
const initialState = {
  idea: null,
  features: [],
  selectedFeatureIds: [],
  frameworks: [],
  selectedFrameworkId: 0,
  starterRepo: null,
};

// Persit in local storage to keep state on page refresh
const persistOptions: PersistOptions<CreateProjectState> = {
  name: "create-project",
};

export const useCreateProjectStore = create<CreateProjectState>()(
  persist(
    (set, get) => ({
      // default state
      ...initialState,

      // actions
      setIdea: (idea) => set({ idea }),
      setFeatures: (features) => set({ features }),
      setFrameworks: (frameworks) => set({ frameworks }),
      setFeature: (feature: Feature) =>
        set((state) => ({
          features: state.features.map((f) =>
            f.id === feature.id ? feature : f,
          ),
        })),
      setFramework: (framework: Framework) =>
        set((state) => ({
          frameworks: state.frameworks.map((f) =>
            f.id === framework.id ? framework : f,
          ),
        })),
      setStarterRepo: (url) => set({ starterRepo: url }),
      resetState: () => set(initialState),

      // helpers
      getSelectedFeatures: () =>
        get().features.filter((feature) =>
          get().selectedFeatureIds.includes(feature.id),
        ),
      getSelectedFramework: () =>
        get().frameworks.find(
          (framework) => framework.id === get().selectedFrameworkId,
        ),
    }),
    persistOptions,
  ),
);
