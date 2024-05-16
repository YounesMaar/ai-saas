import { FC, useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { MAX_FREE_COUNTS } from "@/constants";
import { Progress } from "@/components/ui/progress";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import { useProModal } from "@/hooks/use-pro-model";

interface FreeCounterProps {
  apiLimitCount: number;
  isPro: boolean;
}

const FreeCounter: FC<FreeCounterProps> = ({
  apiLimitCount = 0,
  isPro = false,
}) => {
  const [mounted, setMounted] = useState(false);
  const proModal = useProModal();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (isPro) return null;
  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-2">
          <div className="text-center text-sm text-white mb-4 space-y-2">
            <p>
              {apiLimitCount} / {MAX_FREE_COUNTS} Free Generations
            </p>
            <Progress
              value={(apiLimitCount / MAX_FREE_COUNTS) * 100}
              className="h-3"
            />
            <Button
              onClick={() => proModal.onOpen()}
              variant="premium"
              className="w-full"
            >
              Upgrade
              <Zap className="h-4 w-4 ml-2 fill-white" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreeCounter;
