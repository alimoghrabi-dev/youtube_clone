"use client";

import toast from "react-hot-toast";
import { DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { PenSquare, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

interface EditDeletePostProps {
  postId: string;
  setIsEdittingForm: (isEdittingForm: boolean) => void;
}

const EditDeletePost = ({ postId, setIsEdittingForm }: EditDeletePostProps) => {
  const router = useRouter();

  const handleDeletePost = async () => {
    const response = await fetch("/api/post", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId,
      }),
    });

    if (response.ok) {
      toast.success("Post deleted");

      router.refresh();
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <DropdownMenuContent className="mb-2 w-32 space-y-1 rounded-lg border-0 bg-neutral-800 px-0 py-3 text-gray-50">
      <DropdownMenuItem
        onClick={() => setIsEdittingForm(true)}
        className="flex w-full items-center gap-x-3 px-5 py-2 text-sm font-normal hover:bg-neutral-700"
      >
        <PenSquare size={20} />
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <button
          onClick={handleDeletePost}
          className="flex w-full items-center gap-x-3 px-5 py-2 text-sm font-normal hover:bg-neutral-700"
        >
          <Trash size={20} />
          Delete
        </button>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};

export default EditDeletePost;
