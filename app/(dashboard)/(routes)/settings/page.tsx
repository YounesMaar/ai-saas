import Heading from "@/components/Heading";
import SubscriptionButton from "@/components/SubscriptionButton";
import { checkSubscrpition } from "@/lib/subscription";
import { Settings } from "lucide-react";
import React from "react";

const SettingsPage = async () => {
  const isPro = await checkSubscrpition();
  return (
    <div className="">
      <Heading
        title="Settings"
        description="Manage account settings."
        Icon={Settings}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-8 space-y-4">
        <div className="text-muted-foreground text-sm">
          {isPro
            ? "Your are currently on a pro plan."
            : "You are currently on a free plan."}
        </div>
        <SubscriptionButton isPro={isPro} />
      </div>
    </div>
  );
};

export default SettingsPage;
