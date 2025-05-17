import React, { useEffect, useState, useRef } from "react";
import ChannelList from "../components/ChannelList";
import ChannelVideos from "../components/ChannelVideos";

export default function ChannelView() {
  const [selectedChannel, setSelectedChannel] = useState(() => {
    return localStorage.getItem("selectedChannel") || null;
  });

  const handleChannelSelect = (channelId) => {
    setSelectedChannel(channelId);
    localStorage.setItem("selectedChannel", channelId);
  };

  return (
    <div className="flex h-full divide-x divide-gray-700">
      <div className="w-64 overflow-y-auto">
        <ChannelList selected={selectedChannel} onSelect={handleChannelSelect} />
      </div>
      <div className="flex-1 overflow-y-auto">
        {selectedChannel ? (
          <ChannelVideos channelId={selectedChannel} />
        ) : (
          <div className="p-4 text-gray-400">Select a channel to view videos.</div>
        )}
      </div>
    </div>
  );
}
