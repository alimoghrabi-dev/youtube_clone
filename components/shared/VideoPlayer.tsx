"use client";

import MuxPlayer from "@mux/mux-player-react";

const VideoPlayer = ({
  playbackId,
}: {
  playbackId: string | null | undefined;
}) => {
  return (
    <MuxPlayer
      playbackId={playbackId!}
      accentColor="#FF0000"
      className="h-[70vh]"
    />
  );
};

export default VideoPlayer;
