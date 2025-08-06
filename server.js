import { WebSocketServer } from 'ws';
import startYouTubeChat from './mess.js';

const wss = new WebSocketServer({ port: 8080 });
const VIDEO_ID = 'wnWKS7JEqWM';

// Start YouTube crawler
startYouTubeChat(VIDEO_ID, (message) => {
  // Broadcast messages to all connected clients
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
});

console.log('WebSocket server running on ws://localhost:8080');