import React from "react";

type TApplogo = {
  size?: "medium" | "small" | "large";
  textColor?: string;
  isWithText?: boolean;
};

const AppLogo = ({
  size: logoSize = "large",
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
    <div className="flex gap-4 justify-center items-center">
      <img src="/logos/logo.png" alt="Tamil Adventure Trekking Club Logo" className={selectedSizeClass} />
      {isWithText && (
        <div className="flex flex-col leading-tight py-1">
          <span className={`text-2xl font-bold ${textColor}`}>
            Tamil Adventure
          </span>
          <span className={`text-xl font-semibold ${textColor} opacity-90`}>
            Trekking Club
          </span>
        </div>
      )}
    </div>
  );
};

export default AppLogo;
