import { Idea } from "../types";

const sampleIdea = {
  title: "Virtual Fitness Trainer",
  features: [
    {
      title: "Virtual Workout Partner Matching",
      userStory:
        "As a user, I want to be matched with a virtual workout partner so that I can stay motivated and accountable in my fitness journey.",
      acceptanceCriteria: [
        "Match users with similar fitness goals and schedules to workout together virtually.",
        "Notify users when a suitable workout partner is found.",
      ],
    },
    {
      title: "Progress Tracking",
      userStory:
        "As a user, I want to track my workout progress and achievements so that I can see my improvements over time.",
      acceptanceCriteria: [
        "Allow users to log their workouts and track their progress over time.",
        "Allow users to set goals and track their progress towards those goals.",
      ],
    },
    {
      title: "Motivational Messaging",
      userStory:
        "As a user, I want to receive motivational messages and reminders so that I can stay motivated and committed to my fitness goals.",
      acceptanceCriteria: [
        "Send motivational messages and reminders to users at regular intervals.",
        "Allow users to customize the frequency and content of motivational messages.",
      ],
    },
  ],
  frameworks: [
    {
      title: "Web Application",
      description:
        "Developed using React for the frontend, Node.js for the backend, and MySQL for database management",
      tools: ["react", "nodejs", "mysql"],
    },
    {
      title: "Mobile Application",
      description:
        "Built with Swift for iOS and Kotlin for Android, utilizing Firebase for real-time database updates",
      tools: ["swift", "kotlin", "firebase"],
    },
    {
      title: "CLI Tool",
      description:
        "Written in Python, with the use of Google Cloud Speech-to-Text API, for transcription and customization features",
      tools: ["python", "googlecloud"],
    },
  ],
};

export default sampleIdea as Idea;
