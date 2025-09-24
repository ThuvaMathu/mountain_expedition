import React from "react";

type TApplogo = {
  size?: "medium" | "small" | "large";
  textColor?: string;
  isWithText?: boolean;
};

const AppLogo = ({
  size: logoSize = "small",
  textColor = "text-gray-900",
  isWithText = true,
}: TApplogo) => {
  const sizeClasses = {
    small: "w-10 h-10",
    medium: "w-14 h-14",
    large: "w-20 h-20",
  };

  const selectedSizeClass = sizeClasses[logoSize] || sizeClasses.medium;

  return (
    <div className="flex gap-2 justify-center items-center">
      <img src="/logos/logo.png" alt="App Logo" className={selectedSizeClass} />
      {isWithText && (
        <span className={`text-xl font-bold ${textColor}`}>
          Tamil Adventure
        </span>
      )}
    </div>
  );
};

export default AppLogo;
