"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ImageIcon, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";

const CreatePostForm = ({ userId }: { userId: string | undefined }) => {
  const router = useRouter();

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<string>("");

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setIsUploadingImage(false);
    setImage("");
    setContent("");
  };

  const handleSubmit = async () => {
    setIsPosting(true);

    try {
      const response = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          content,
          image,
        }),
      });

      if (response.ok) {
        toast.success("Post created");

        router.refresh();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log("[CREATE_POST]", error);
    } finally {
      setIsPosting(false);
      handleBlur();
    }
  };

  return (
    <div
      className={cn(
        "w-[360px] rounded-xl border border-neutral-600/85 p-4 transition-all sm:w-[480px] md:w-[550px] lg:w-[600px]",
        isFocused ? "bg-neutral-800" : "bg-background",
      )}
    >
      <Input
        value={content}
        onFocus={handleFocus}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="rounded-none border-0 bg-transparent px-0 outline-none placeholder:text-sm placeholder:font-normal placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0 sm:placeholder:text-base"
      />
      <div
        className={cn(
          "flex w-full items-center",
          isUploadingImage ? "justify-end" : "justify-between",
        )}
      >
        {!isUploadingImage && (
          <button
            onClick={() => {
              setIsFocused(true);
              setIsUploadingImage(true);
            }}
            className="flex items-center gap-x-2 rounded-full px-4 py-2 text-sm font-medium text-neutral-200 transition hover:bg-neutral-700/60"
          >
            <ImageIcon size={20} />
            Add Image
          </button>
        )}

        <div className="flex items-center gap-x-3">
          {isFocused && (
            <button
              onClick={handleBlur}
              className="rounded-full bg-transparent px-4 py-2.5 text-[13px] font-medium text-white transition hover:bg-neutral-600/50"
            >
              Cancel
            </button>
          )}

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isFocused || isPosting || (!content && !image)}
            className="rounded-full bg-blue-500/90 text-sm font-medium text-black transition hover:bg-blue-400/80 disabled:bg-neutral-600/80 disabled:text-gray-50"
          >
            {isPosting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post"}
          </Button>
        </div>
      </div>
      {isUploadingImage && (
        <div className="relative mt-2.5 flex h-[250px] w-full items-center justify-center rounded-xl bg-neutral-900">
          <button
            onClick={() => setIsUploadingImage(false)}
            className="absolute right-1 top-1 rounded-full p-1.5 text-neutral-400 transition hover:bg-neutral-700/60"
          >
            <X />
          </button>
          {image ? (
            <Image
              src={image}
              alt="uploaded_image"
              width={900}
              height={900}
              className="h-[80%] w-[80%] rounded-lg object-cover object-center"
            />
          ) : (
            <UploadDropzone
              endpoint="communityImageUploader"
              onClientUploadComplete={(res) =>
                setImage(res[0].serverData?.image!)
              }
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CreatePostForm;
