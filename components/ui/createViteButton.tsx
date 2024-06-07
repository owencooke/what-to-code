import React from "react";
import { Button } from "@/components/ui/button";

const CreateViteButton: React.FC = () => {
  const handleCreateViteApp = async () => {
    try {
      const response = await fetch("/api/create-project", {
        method: "POST", // Specify the method as POST
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data);
      alert("Vite app created successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to create Vite app.");
    }
  };

  return (
    <div>
      <Button onClick={handleCreateViteApp}>Create Vite App</Button>
    </div>
  );
};

export default CreateViteButton;
