'use client';

import { useSocket } from '@/contexts/Socket';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { v4 as uuid } from 'uuid';

export default function CreateRoom() {
  const router = useRouter();
  const { socket } = useSocket();

  const [username, setUsername] = useState<string>();

  function handleCreateRoom() {
    if (username?.length) {
      const roomId = uuid();
      socket.emit('create-room', { name, roomId });
      socket.on('created-room', ({ roomId }) => {
        router.push(`/room?roomId=${roomId}&username=${username}`);
      });
    }
  }

  function handleUsernameChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setUsername(value.trim());
  }

  return (
    <div className="flex flex-col md:w-1/2 md:px-12 gap-4">
      <h4 className="text-md font-semibold underline">Create New Room</h4>
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
        <button
          className=" bg-blue-400 p-2 w-1/2 md:w-1/3 self-center rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
          disabled={!username}
          onClick={handleCreateRoom}
        >
          Create Room
        </button>
      </div>
    </div>
  );
}
``;
