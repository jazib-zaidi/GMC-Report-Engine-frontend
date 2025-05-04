// src/socket/index.js
import { io } from 'socket.io-client';
let currentSocketId = null;
// Connect to the backend
const socket = io(`${import.meta.env.VITE_API_URL}`, {
  withCredentials: true, // Allow cookies, sessions
  transports: ['websocket'], // Optional but recommended
});

// Handle basic connection events
socket.on('connect', () => {
  currentSocketId = socket.id;
  console.log('🟢 Connected to socket server:', socket.id);
});

socket.on('disconnect', () => {
  console.log('🔴 Disconnected from socket server');
});

// Emit custom events
export function startGeneration(data) {
  socket.emit('startGeneration', data);
}

// Listen for custom events
export function onProgressUpdate(callback) {
  socket.on('progressUpdate', callback);
}
export function keywordGenerated(callback) {
  socket.on('keywordGenerated', callback);
}

export function onGenerationComplete(callback) {
  socket.on('generationComplete', callback);
}
export function disconnect() {
  socket.disconnect();
}

export function googleSheet(callback) {
  socket.on('googleSheet', callback);
}
export function mapping(callback) {
  socket.on('mapping', callback);
}

export function promptTokens(callback) {
  socket.on('promptTokens', callback);
}

export function startMapping() {
  socket.emit('startMapping');
}

export function connect() {
  socket.connect();
}

export function getSocketId() {
  return currentSocketId;
}

export default socket;
