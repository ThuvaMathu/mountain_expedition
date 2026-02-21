import React from "react";

type TApplogo = {
  size?: "medium" | "small" | "large" | "xlarge" | "xxlarge" | "xxxlarge";
  textColor?: string;
  isWithText?: boolean;
};

const AppLogo = ({
  size: logoSize = "large",
  textColor = "text-gray-900",
  isWithText = true,
}: TApplogo) => {
  const sizeClasses = {
    small: "w-8 h-8 md:w-10 md:h-10 shrink-0",
    medium: "w-10 h-10 md:w-14 md:h-14 shrink-0",
    large: "w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 shrink-0",
    xlarge: "w-16 h-16 md:w-24 md:h-24 shrink-0",
    xxlarge: "w-20 h-20 md:w-28 md:h-28 shrink-0",
    xxxlarge: "w-24 h-24 md:w-32 md:h-32 shrink-0",
  };

  const selectedSizeClass = sizeClasses[logoSize] || sizeClasses.medium;

  return (
    <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center items-center">
      <img src="/logos/logo.png" alt="Tamil Adventure Trekking Club Logo" className={selectedSizeClass} />
      {isWithText && (
        <div className="flex flex-col leading-tight py-1 whitespace-nowrap">
          <span className={`text-[15px] sm:text-lg md:text-2xl font-bold ${textColor}`}>
            Tamil Adventure
          </span>
          <span className={`text-[11px] sm:text-sm md:text-xl font-semibold ${textColor} opacity-90`}>
            Trekking Club
          </span>
        </div>
      )}
    </div>
  );
};

export default AppLogo;
