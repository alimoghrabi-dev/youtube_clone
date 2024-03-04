"use client";

import { PlaySquare } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { UploadDropzone } from "@/lib/uploadthing";
import { useState } from "react";
import VideoDetailsForm from "./VideoDetailsForm";

const UploadVideoDialog = () => {
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [playbackId, setPlaybackId] = useState("");
  const [videoId, setVideoId] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-full">
        <div className="flex w-full items-center gap-x-3 px-4 py-2.5 text-sm font-normal hover:bg-neutral-700">
          <PlaySquare size={19} />
          Upload Video
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl border-0 bg-neutral-800 px-0">
        <DialogHeader className="items-start border-b border-neutral-700 px-4 pb-4 text-xl font-semibold">
          Upload Video
        </DialogHeader>
        {isUploaded ? (
          <div className="flex justify-between gap-x-2.5 px-4">
            <div className="flex w-[62%] flex-col items-start">
              <VideoDetailsForm setIsOpen={setIsOpen} videoId={videoId} />
            </div>
            <div className="flex w-[48%] flex-col items-start">
              <MuxPlayer
                playbackId={playbackId || ""}
                accentColor="#FF0000"
                className="mt-2"
              />
            </div>
          </div>
        ) : (
          <div className="flex w-full items-center justify-center">
            <UploadDropzone
              endpoint="videoUploader"
              onClientUploadComplete={(res) => {
                setIsUploaded(true);
                setPlaybackId(res[0].serverData?.playbackId!);
                setVideoId(res[0].serverData?.videoId!);
              }}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadVideoDialog;
