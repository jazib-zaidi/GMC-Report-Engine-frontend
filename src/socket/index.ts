// src/socket/index.js
import { io } from 'socket.io-client';

// Connect to the backend
const socket = io('http://gmc-reporting.duckdns.org:3000', {
  withCredentials: true, // Allow cookies, sessions
  transports: ['websocket'], // Optional but recommended
});

// Handle basic connection events
socket.on('connect', () => {
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

export function promptTokens(callback) {
  socket.on('promptTokens', callback);
}

export function connect() {
  console.log('first');
  socket.connect();
}

export default socket;
