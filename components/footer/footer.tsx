import React from "react";
import { APP_NAME } from "@/lib/constants";

const Footer = () => {
  const currentDate = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className="p-5 flex-center">
        {currentDate} {APP_NAME}. All Right Reserved
      </div>
    </footer>
  );
};

export default Footer;
