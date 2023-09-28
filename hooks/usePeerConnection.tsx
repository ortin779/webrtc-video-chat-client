import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

const configuration: RTCConfiguration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
};

export const usePeerConnection = ({
  socket,
  roomId,
  username,
}: {
  roomId: string;
  username: string;
  socket: Socket;
}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>();

  useEffect(() => {
    const initialize = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        const pc = new RTCPeerConnection(configuration);
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });
        setPeerConnection(pc);
      } catch (error) {
        console.error('Error setting up WebRTC:', error);
      }
    };

    initialize();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => (track.enabled = false));
        setLocalStream(null);
      }
    };
  }, []);

  useEffect(() => {
    if (peerConnection) {
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('iceCandidate', roomId, event.candidate);
        }
      };

      peerConnection.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      socket.on('offer', async (remoteOffer) => {
        await handleOffer(remoteOffer);
      });

      socket.on('iceCandidate', async (candidate) => {
        await handleIceCandidate(candidate);
      });

      socket.on('answer', async (answerData) => {
        const remoteDesc = new RTCSessionDescription(answerData);
        await peerConnection.setRemoteDescription(remoteDesc);
      });

      socket.on('user-exit', () => {
        setRemoteStream(null);
      });

      socket.emit('join-room', { username, roomId });
      socket.on('joined-room', async () => {
        await createOffer();
      });
    }
  }, [socket, roomId, username, peerConnection]);

  // Create offer and set local description
  const createOffer = async () => {
    try {
      const offer = await peerConnection?.createOffer();
      await peerConnection?.setLocalDescription(offer);
      socket.emit('offer', roomId, peerConnection?.localDescription);
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const handleOffer = async (offerData: RTCSessionDescriptionInit) => {
    try {
      await peerConnection?.setRemoteDescription(
        new RTCSessionDescription(offerData)
      );
      const answer = await peerConnection?.createAnswer();
      await peerConnection?.setLocalDescription(answer);
      socket?.emit('answer', roomId, peerConnection?.localDescription);
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  // Handle incoming ICE candidate
  const handleIceCandidate = async (candidateData: RTCIceCandidateInit) => {
    try {
      const candidate = new RTCIceCandidate(candidateData);
      await peerConnection?.addIceCandidate(candidate);
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  };

  const handleToggleVideoAudio = async (video: boolean, audio: boolean) => {
    if (localStream) {
      const videoTrack = localStream
        .getTracks()
        .find((track) => track.kind === 'video');

      if (videoTrack) {
        videoTrack.enabled = video;
      }

      const audioTrack = localStream
        .getTracks()
        .find((track) => track.kind === 'audio');

      if (audioTrack) {
        audioTrack.enabled = audio;
      }
    }
  };

  return {
    localStream,
    remoteStream,
    handleToggleVideoAudio,
  } as const;
};
