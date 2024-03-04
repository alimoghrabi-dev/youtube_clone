"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { useState } from "react";
import { cn, formUrlQuery } from "@/lib/utils";

const VideoCategories = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [active, setActive] = useState("");

  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive("");
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: null,
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(item);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: item.toLowerCase(),
      });

      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="flex items-center gap-x-2.5">
      <Button
        onClick={() => handleTypeClick("latest")}
        size={"sm"}
        className={cn(
          "rounded-lg text-sm font-bold text-gray-50 hover:text-gray-50",
          active === "latest"
            ? "bg-gray-100 text-gray-950 hover:bg-gray-100 hover:text-gray-950"
            : "bg-neutral-700 hover:bg-neutral-600",
        )}
      >
        Latest
      </Button>
      <Button
        onClick={() => handleTypeClick("popular")}
        size={"sm"}
        className={cn(
          "rounded-lg text-sm font-bold text-gray-50 hover:text-gray-50",
          active === "popular"
            ? "bg-gray-100 text-gray-950 hover:bg-gray-100 hover:text-gray-950"
            : "bg-neutral-700 hover:bg-neutral-600",
        )}
      >
        Popular
      </Button>
      <Button
        onClick={() => handleTypeClick("oldest")}
        size={"sm"}
        className={cn(
          "rounded-lg text-sm font-bold text-gray-50 hover:text-gray-50",
          active === "oldest"
            ? "bg-gray-100 text-gray-950 hover:bg-gray-100 hover:text-gray-950"
            : "bg-neutral-700 hover:bg-neutral-600",
        )}
      >
        Oldest
      </Button>
    </div>
  );
};

export default VideoCategories;
