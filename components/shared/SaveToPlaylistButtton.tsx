"use client";

import { RiPlayListAddLine } from "react-icons/ri";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Playlist } from "@prisma/client";
import { Loader2, Lock, Plus, Unlock } from "lucide-react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SaveToPlaylistButtton = ({
  userPlaylists,
  videoId,
}: {
  userPlaylists: Playlist[] | null;
  videoId: string | undefined;
}) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [createPlaylist, setCreatePlaylist] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const togglePrivacy = () => {
    setIsPrivate((prevState) => !prevState);
  };

  useEffect(() => {
    if (!isOpen) {
      setCreatePlaylist(false);
    }
  }, [isOpen]);

  const onAddRemoveFromPlaylist = async (playlistId: string) => {
    try {
      const response = await fetch("/api/playlist", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId,
          playlistId,
        }),
      });

      if (response.ok) {
        toast.success("Added to playlist");
        router.refresh();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreatePlaylist = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: input,
          isPrivate,
        }),
      });

      if (response.ok) {
        toast.success("Playlist created");
        router.refresh();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setInput("");
      setIsPrivate(false);
      setCreatePlaylist(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-neutral-700 px-2.5 hover:bg-neutral-600">
          <RiPlayListAddLine size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs rounded-lg border-none bg-neutral-800 px-4 py-2.5 shadow-md shadow-neutral-800/70">
        <DialogHeader className="flex w-full items-start text-base font-normal">
          Save video to...
        </DialogHeader>
        <DialogDescription className="space-y-1.5 py-1.5">
          {userPlaylists?.length === 0 && (
            <p className="text-center text-base font-medium">
              You don&apos;t have any playlists
            </p>
          )}
          {userPlaylists?.map((playlist) => (
            <div
              key={playlist.id}
              className="flex w-full items-center justify-between"
            >
              <div className="flex items-center gap-x-2">
                {playlist.videos.find((p) => p.includes(videoId!)) ? (
                  <button
                    onClick={() => onAddRemoveFromPlaylist(playlist.id)}
                    className="flex items-center justify-center rounded-md px-2 py-1 text-red-500 transition hover:bg-red-500/[0.15] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    onClick={() => onAddRemoveFromPlaylist(playlist.id)}
                    className="flex items-center justify-center rounded-md px-2 py-1 text-blue-500 transition hover:bg-blue-500/[0.15] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Add
                  </button>
                )}

                <p className="text-base font-medium text-gray-50">
                  {playlist.title}
                </p>
              </div>
              {playlist.isPublic ? <Unlock size={19} /> : <Lock size={19} />}
            </div>
          ))}
        </DialogDescription>
        <DialogFooter>
          {createPlaylist ? (
            <div className="flex w-full flex-col items-start gap-y-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Name"
                className="border-b border-gray-400 bg-transparent py-0.5 outline-none transition placeholder:text-neutral-500 focus:border-gray-200"
              />
              <div className="flex items-center gap-x-2">
                <input
                  checked={isPrivate}
                  onChange={togglePrivacy}
                  type="checkbox"
                  className="cursor-pointer bg-black outline-none"
                />
                <p className="text-sm font-medium text-gray-50">Private</p>
              </div>

              <button
                disabled={isLoading}
                onClick={handleCreatePlaylist}
                className="flex w-20 items-center justify-center rounded-full px-1.5 py-1 font-medium text-blue-500 transition hover:bg-blue-500/[0.15] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Create"
                )}
              </button>
            </div>
          ) : (
            <Button
              variant={"ghost"}
              onClick={() => setCreatePlaylist(true)}
              size={"sm"}
              className="flex w-full items-center gap-x-2 font-medium"
            >
              <Plus />
              Create new Playlist
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveToPlaylistButtton;
