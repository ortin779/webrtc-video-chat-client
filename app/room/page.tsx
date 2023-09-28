'use client';

import { VideoPlayer } from '@/components/VideoPlayer';
import { useSocket } from '@/contexts/Socket';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Room() {
  const { socket } = useSocket();
  const searchParams = useSearchParams();
  const roomId = searchParams.get('roomId');
  const username = searchParams.get('username');

  useEffect(() => {
    return () => {
      socket.emit('end-call', roomId);
    };
  }, []);
  return (
    <div className="h-screen overflow-hidden">
      {roomId && username && (
        <VideoPlayer roomId={roomId} username={username} />
      )}
    </div>
  );
}
