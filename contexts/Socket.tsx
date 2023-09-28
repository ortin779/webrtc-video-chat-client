'use client';

import { PropsWithChildren, createContext, useContext } from 'react';
import { Socket, io } from 'socket.io-client';

type SocketContextValue = {
  socket: Socket;
};

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || '', {
  transports: ['websocket'],
});

export const SocketContextProvider = ({ children }: PropsWithChildren) => {
  socket.on('error', (error) => {
    console.log('Error', error);
  });
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext)!;
