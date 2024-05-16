"use client";

import { FC, useState } from "react";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface SubscriptionButtonProps {
  isPro: boolean;
}

const SubscriptionButton: FC<SubscriptionButtonProps> = ({ isPro = false }) => {
  const [loading, setLoading] = useState(false);
  const onClick = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/stripe");

      window.location.href = data.url;
    } catch (error) {
      console.log("BILLING_ERROR", error);
      toast.error("something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      disabled={loading}
      variant={isPro ? "default" : "premium"}
      onClick={onClick}
    >
      {isPro ? "Manage Subscription" : "Upgrade"}
      {isPro && <Zap className="w-4 h-4 ml-2 fillwhite" />}
    </Button>
  );
};

export default SubscriptionButton;
