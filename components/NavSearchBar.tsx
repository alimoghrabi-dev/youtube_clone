"use client";

import { History, Search, X } from "lucide-react";
import HoverIcon from "./shared/HoverIcon";
import { useRouter } from "next/navigation";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { SearchHistory } from "@prisma/client";
import Link from "next/link";
import toast from "react-hot-toast";

interface NavSearchBarProps {
  userId: string | undefined;
  searchHistories: SearchHistory[] | null | undefined;
}

const NavSearchBar = ({ userId, searchHistories }: NavSearchBarProps) => {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef(null);

  const handleSearch = async () => {
    const queryString = query.trim();

    await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, query: queryString }),
    });

    if (queryString) {
      router.push("/results?query=" + queryString);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      //@ts-ignore
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsOpen(true);
    }
  }, [isOpen, router]);

  const handleDeleteSearchHistory = async (id: string) => {
    try {
      const response = await fetch("/api/search", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      if (response.ok) {
        toast.success("Search history removed");
        router.refresh();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log("[DELETE_SEARCH_HISTORY]", error);
    }
  };

  return (
    <div className="relative hidden w-[45%] justify-center sm:flex">
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-16 top-[3px] z-20 rounded-full p-1.5 transition hover:bg-neutral-600"
        >
          <X className="text-neutral-300" />
        </button>
      )}
      <input
        value={query}
        onFocus={() => setIsOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        onChange={(e: { target: { value: SetStateAction<string> } }) => {
          setQuery(e.target.value);
        }}
        placeholder="Search"
        className="w-full rounded-l-full border border-r-0 border-slate-300/25 bg-transparent px-4 py-2 outline-none transition-all placeholder:text-base placeholder:font-medium placeholder:text-gray-400/70 focus-visible:border-blue-500 focus-visible:ring-0"
      />
      <button
        onClick={handleSearch}
        className="flex items-center justify-center rounded-r-full border border-l-0 border-slate-300/25 bg-neutral-800 pl-4 pr-5"
      >
        <HoverIcon
          icon={Search}
          content="Search"
          size={22}
          className="text-gray-300"
        />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute mt-12 w-full rounded-xl bg-neutral-800 py-2 shadow-lg shadow-neutral-800/25"
        >
          {searchHistories?.map((searchHistory) => (
            <div
              key={searchHistory.id}
              className="relative flex w-full cursor-pointer items-center justify-end px-5 py-1 transition hover:bg-neutral-700"
            >
              <Link href={`/results?query=${searchHistory.label}`}>
                <span className="flex items-center gap-x-2.5">
                  <p className="text-base font-semibold text-gray-100">
                    {searchHistory.label}
                  </p>
                  <History size={20} className="text-gray-200" />
                </span>
              </Link>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  handleDeleteSearchHistory(searchHistory.id);
                }}
                className="absolute left-0 top-0.5 z-20 px-5 py-1 text-sm text-blue-500 transition hover:text-blue-400 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}

          {searchHistories?.length === 0 && (
            <h4 className="px-5 py-2 text-sm font-semibold text-gray-300">
              No search history
            </h4>
          )}
        </div>
      )}
    </div>
  );
};

export default NavSearchBar;
