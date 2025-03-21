"use client";

import CustomSwitch from "@/app/components/ThemeToggle";
import StoryPost from "../../(home)/components/Story/StoryPost";
import { useState } from "react";

export default function Page() {
  const [checked, setChecked] = useState<boolean>(false);
  const handleToggle = () => {
    console.log("handleToggle");
    setChecked(!checked);
  };
  return (
    <div className="flex flex-col items-center">
      <StoryPost></StoryPost>
      <CustomSwitch onToggle={handleToggle} checked={checked}></CustomSwitch>
    </div>
  );
}
