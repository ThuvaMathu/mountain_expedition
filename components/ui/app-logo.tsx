import React from "react";

type TApplogo = {
  logoSize?: "medium" | "small" | "large";
  textColor?: string;
};

const AppLogo = ({
  logoSize = "medium",
  textColor = "text-gray-900",
}: TApplogo) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-10 h-10",
    large: "w-12 h-12",
  };

  const selectedSizeClass = sizeClasses[logoSize] || sizeClasses.medium;

  return (
    <div className="flex gap-2 justify-center items-center">
      <img src="/logos/logo.png" alt="App Logo" className={selectedSizeClass} />
      <span className={`text-xl font-bold ${textColor}`}>Tamil Adventure</span>
    </div>
  );
};

export default AppLogo;
