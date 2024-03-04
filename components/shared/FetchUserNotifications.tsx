import { Bell } from "lucide-react";
import HoverIcon from "./HoverIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Notification } from "@prisma/client";
import NotificationItem from "./NotificationItem";
import MarkNotificationsAsRead from "./MarkNotificationsAsRead";

const FetchUserNotifications = ({
  notifications,
  userId,
}: {
  notifications: Notification[] | undefined;
  userId: string | undefined;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative outline-none">
        <HoverIcon
          icon={Bell}
          content="Notifications"
          size={40}
          className="cursor-pointer rounded-full p-2 transition hover:bg-neutral-800"
        />
        {notifications?.length !== 0 && (
          <div className="absolute right-1 top-1 h-[11px] w-[11px] rounded-full bg-primary/90 ring-[1px] ring-primary/40 ring-offset-2 ring-offset-black" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="absolute -top-12 right-7 w-[400px] rounded-lg border-0 bg-neutral-800 px-0 py-2 text-gray-50">
        <div className="flex w-full items-center justify-between pr-2">
          <DropdownMenuLabel className="px-4 text-start text-xl font-semibold">
            Notifications
          </DropdownMenuLabel>
          <MarkNotificationsAsRead
            notifications={notifications}
            userId={userId}
          />
        </div>
        <DropdownMenuSeparator className="bg-neutral-600" />
        {notifications?.length === 0 && (
          <DropdownMenuItem className="flex w-full items-center justify-center py-8">
            <p className="text-center text-lg font-semibold text-gray-200">
              No Notifications
            </p>
          </DropdownMenuItem>
        )}

        {notifications?.map((notification) => (
          <NotificationItem
            key={notification.id}
            commentId={notification.commentId}
            videoId={notification.videoId}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FetchUserNotifications;
