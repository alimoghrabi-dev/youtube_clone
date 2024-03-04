import { BiDislike, BiLike } from "react-icons/bi";
import { Button } from "../ui/button";
import HoverIcon from "./HoverIcon";

const LikeDislikeReplyComment = ({ commentId }: { commentId: string }) => {
  const handleLikeComment = async () => {
    try {
      const response = await fetch("/api/comment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId,
        }),
      });
    } catch (error) {}
  };

  return (
    <>
      <HoverIcon
        icon={BiLike}
        content="Like"
        size={30}
        className="cursor-pointer rounded-full p-1.5 text-gray-50 transition hover:bg-neutral-700"
      />
      <HoverIcon
        icon={BiDislike}
        content="Dislike"
        size={30}
        className="cursor-pointer rounded-full p-1.5 text-gray-50 transition hover:bg-neutral-700"
      />
      <Button
        variant={"ghost"}
        size={"sm"}
        className="ml-2 rounded-full px-2.5 py-1 font-semibold hover:bg-neutral-700 hover:text-gray-50"
      >
        Reply
      </Button>
    </>
  );
};

export default LikeDislikeReplyComment;
