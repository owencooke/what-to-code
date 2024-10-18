import { Code2, MessageCircleQuestion } from "lucide-react";
import React from "react";

const Logo: React.FC = () => (
  <div className="relative w-10 h-9 min-w-10">
    <Code2 className="h-5 absolute bottom-0 left-0" />
    <MessageCircleQuestion className="h-5 absolute top-0 right-0" />
  </div>
);

export default Logo;
