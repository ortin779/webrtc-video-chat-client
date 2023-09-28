'use client';

import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';

export const JoinRoom = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>();
  const [roomId, setRoomId] = useState<string>();

  const handleRoomIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setRoomId(value.trim());
  };

  function handleUsernameChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setUsername(value.trim());
  }

  function handleJoinRoom() {
    if (username && roomId) {
      router.push(`/room?roomId=${roomId}&username=${username}`);
    }
  }

  return (
    <div className="flex flex-col md:w-1/2 md:px-12 gap-4">
      <h4 className="text-md my-2 font-semibold underline">Join a Room</h4>
      <div className="flex flex-col gap-4 md:flex-row">
        <input
          id="name"
          value={username || ''}
          type="text"
          required
          className="px-2 py-2 w-full rounded-md text-black"
          placeholder="Name"
          onChange={handleUsernameChange}
        />
        <input
          id="roomId"
          value={roomId || ''}
          type="text"
          required
          className="px-2 py-2 w-full rounded-md text-black"
          placeholder="Room Id"
          onChange={handleRoomIdChange}
        />
        <button
          className=" bg-blue-400 p-2 w-1/2 md:w-1/3 self-center rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
          disabled={!roomId || !username}
          onClick={handleJoinRoom}
        >
          Join
        </button>
      </div>
    </div>
  );
};
