'use client';

import { useSocket } from '@/contexts/Socket';
import { usePeerConnection } from '@/hooks/usePeerConnection';
import { useEffect, useRef } from 'react';
import { RoomControls } from './RoomControls';
import { useRouter } from 'next/navigation';

export type VideoPlayerProps = {
  roomId: string;
  username: string;
};

export const VideoPlayer = ({ roomId, username }: VideoPlayerProps) => {
  const { socket } = useSocket();
  const router = useRouter();
  const { localStream, remoteStream, handleToggleVideoAudio } =
    usePeerConnection({
      roomId,
      username,
      socket,
    });

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    socket.emit('end-call', roomId);
    router.replace('/');
  };

  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row p-4 h-[90%] gap-4 border-white border-solid">
        <video
          ref={localVideoRef}
          autoPlay
          className={`flex-1 rounded-md border-blue-300 border-solid border-2 w-full ${
            remoteStream ? 'absolute top-5 right-5 w-48' : ''
          }`}
        />
        {remoteStream && (
          <video
            ref={remoteVideoRef}
            autoPlay
            className="flex-1 rounded-md border-purple-300 border-solid border-2 w-full"
          />
        )}
      </div>
      <div className="flex flex-row h-[10%] border-white border-solid">
        <RoomControls
          onVideoAudioToggle={handleToggleVideoAudio}
          onEndCall={handleEndCall}
        />
      </div>
    </div>
  );
};
