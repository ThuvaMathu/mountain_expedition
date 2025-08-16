import Image from "next/image";
import React from "react";

function AppLogo() {
  return (
    <>
      <Image src="/logos/logo.png" alt="App Logo" width={40} height={40} />
    </>
  );
}

export default AppLogo;
