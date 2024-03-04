"use client";

import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Notification } from "@prisma/client";
import { CheckCheck, Loader2 } from "lucide-react";

const MarkNotificationsAsRead = ({
  notifications,
  userId,
}: {
  notifications: Notification[] | undefined;
  userId: string | undefined;
}) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRead = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/notifications", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      });

      if (response.ok) {
        toast.success("All notifications marked as read");

        router.refresh();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      disabled={isLoading || notifications?.length === 0}
      onClick={handleRead}
      size={"sm"}
      className="bg-neutral-700 hover:bg-neutral-600"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          Mark all as read
          <CheckCheck size={20} className="ml-1.5" />
        </>
      )}
    </Button>
  );
};

export default MarkNotificationsAsRead;
