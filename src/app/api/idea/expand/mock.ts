import { Feature, Framework } from "@/types/idea";

export const mockFeatures: Feature[] = [
  {
    id: 0,
    title: "Progress Tracking",
    userStory:
      "As a user, I want to track my daily fitness activities and visualize my progress over time so that I can stay accountable and motivated.",
    acceptanceCriteria: [
      "User can log various types of activities such as workouts, steps, and calories burned.",
      "System calculates and displays user's total progress and achievements.",
      "User can view graphs and charts to visualize their fitness journey.",
    ],
  },
  {
    id: 1,
    title: "Social Features",
    userStory:
      "As a social user, I want to interact with other users, share achievements, and participate in group challenges so that I can stay connected and motivated.",
    acceptanceCriteria: [
      "User can follow other users, like and comment on their posts.",
      "User can create or join group challenges with friends or the community.",
      "System notifies user of friends' activities and challenges.",
    ],
  },
  {
    id: 2,
    title: "Challenge Creation",
    userStory:
      "As a fitness enthusiast, I want to create challenges with customizable parameters so that I can challenge my friends and stay motivated.",
    acceptanceCriteria: [
      "User can set challenge name, duration, start date, and invite friends to join.",
      "System validates challenge parameters and displays error messages for invalid inputs.",
      "Challenge details are saved and displayed in user's dashboard.",
    ],
  },
];

export const mockFrameworks: Framework[] = [
  {
    id: 0,
    title: "Mobile App",
    tools: ["reactnative", "firebase", "redux"],
    description:
      "The Fitness Challenge App will be built as a mobile application using React Native for cross-platform development. The app will leverage Firebase for real-time database and authentication, and Redux for state management.",
  },
  {
    id: 1,
    title: "Web App",
    tools: ["react", "nodejs", "mongodb"],
    description:
      "The Fitness Challenge App will also have a web version built with React for the frontend, Node.js for the backend, and MongoDB for the database. This will provide users with a seamless experience across devices.",
  },
  {
    id: 2,
    title: "Machine Learning",
    tools: ["tensorflow", "keras", "python"],
    description:
      "The Fitness Challenge App will utilize machine learning models to provide personalized recommendations and insights to users. TensorFlow and Keras will be used for model training and deployment, with Python as the primary programming language.",
  },
];
