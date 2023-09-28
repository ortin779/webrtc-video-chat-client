'use client';

import { useEffect, useState } from 'react';
import {
  BiMicrophone,
  BiMicrophoneOff,
  BiPhoneOff,
  BiVideo,
  BiVideoOff,
} from 'react-icons/bi';

export type RoomControlsProps = {
  onVideoAudioToggle(video: boolean, audio: boolean): void;
  onEndCall(): void;
};

export const RoomControls = ({
  onVideoAudioToggle,
  onEndCall,
}: RoomControlsProps) => {
  const [isMicroPhoneOn, setIsMicroPhoneOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const handleMicrophoneToggle = () => {
    setIsMicroPhoneOn((prev) => !prev);
  };

  const handleVideoToggle = () => {
    setIsVideoOn((prev) => !prev);
  };

  useEffect(() => {
    onVideoAudioToggle(isVideoOn, isMicroPhoneOn);
  }, [isMicroPhoneOn, isVideoOn]);

  return (
    <div className="flex w-full items-center p-4 justify-center gap-8">
      <div
        onClick={handleMicrophoneToggle}
        className={`${
          isMicroPhoneOn
            ? 'bg-blue-400 hover:bg-blue-500'
            : 'bg-red-400 hover:bg-red-500'
        } rounded-full p-2 hover:cursor-pointer`}
      >
        {isMicroPhoneOn ? (
          <BiMicrophone size={'2rem'} />
        ) : (
          <BiMicrophoneOff size={'2rem'} />
        )}
      </div>
      <div
        onClick={handleVideoToggle}
        className={`${
          isVideoOn
            ? 'bg-blue-400 hover:bg-blue-500'
            : 'bg-red-400 hover:bg-red-500'
        } rounded-full p-2 hover:cursor-pointer`}
      >
        {isVideoOn ? <BiVideo size={'2rem'} /> : <BiVideoOff size={'2rem'} />}
      </div>
      <div
        onClick={onEndCall}
        className={'bg-red-400 rounded-full p-2 hover:cursor-pointer'}
      >
        {<BiPhoneOff size={'2rem'} />}
      </div>
    </div>
  );
};
