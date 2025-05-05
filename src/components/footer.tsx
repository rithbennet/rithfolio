import React from "react";
import { SocialLinks } from "./social-links";

export const Footer = () => {
  return (
    <footer className="container mx-auto mt-10 border-t px-4 py-6 sm:mt-20 sm:py-8">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-foreground/60 text-center text-xs sm:text-left sm:text-sm">
          © {new Date().getFullYear()} Portfolio. All rights reserved.
        </p>
        <div className="mt-2 sm:mt-0">
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
};
