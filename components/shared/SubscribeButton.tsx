"use client";

import { Check, Loader2, X } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SubscribeButtonProps {
  userSubscribers: String[] | undefined;
  profileId: string | undefined;
  userId: string;
}

const SubscribeButton = ({
  userSubscribers,
  profileId,
  userId,
}: SubscribeButtonProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubscribe = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoUserId: profileId,
        }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.log("[SUBSCRIBE]", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      disabled={isLoading}
      onClick={handleSubscribe}
      variant={"ghost"}
      className={cn(
        "mt-2 flex items-center gap-x-1.5 rounded-full bg-gray-100 px-4 text-sm font-medium text-black hover:bg-gray-300",
        userSubscribers?.includes(userId!) &&
          "bg-neutral-700/60 text-gray-200 hover:bg-neutral-700 hover:text-gray-200",
      )}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {userSubscribers?.includes(userId!) ? (
            <>
              <X size={20} />
              Unsubscribe
            </>
          ) : (
            <>
              <Check size={20} />
              Subscribe
            </>
          )}
        </>
      )}
    </Button>
  );
};

export default SubscribeButton;
