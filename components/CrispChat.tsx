"use client";

import { Crisp } from "crisp-sdk-web";
import { useEffect } from "react";

const CripsChat = () => {
  useEffect(() => {
    Crisp.configure("95cb32c5-5014-45c5-b756-bdc2ca77761a");
  }, []);
  return null;
};
window.CRISP_WEBSITE_ID;
export default CripsChat;
