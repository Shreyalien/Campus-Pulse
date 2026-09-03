import { io } from 'socket.io-client';

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(window.location.origin, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
  }
  return socket;
}
