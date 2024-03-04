import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

type HoverIconProps = {
  icon: LucideIcon | IconType;
  content: string;
  size: number;
  className: string;
  onClick?: () => void;
};

const HoverIcon = ({
  icon: Icon,
  content,
  size,
  className,
  onClick,
}: HoverIconProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger onClick={onClick}>
        <Icon size={size} className={className} />
      </HoverCardTrigger>
      <HoverCardContent>{content}</HoverCardContent>
    </HoverCard>
  );
};

export default HoverIcon;
