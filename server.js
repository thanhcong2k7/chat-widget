import { WebSocketServer } from 'ws';
import fs from 'fs/promises';
import axios from 'axios';
import http from 'http';
import path from 'path';

// ARGS:
//

import { google } from 'googleapis';

console.log(">> Getting latest stream ID...");
const API_KEY = 'AIzaSyBuaZdVRKqWUBiHteuvCbMoBx4Dg1lEsOg'; //Based on user
const CHANNEL_ID = 'UCKxNFz11jaNB7yCBWTloDMA';
let VIDEO_ID = '';

const youtube = google.youtube({
  version: 'v3',
  auth: API_KEY,
});

async function getLatestLivestream() {
  try {
    const res = await youtube.search.list({
      part: 'snippet',
      channelId: CHANNEL_ID,
      eventType: 'live',
      type: 'video',
      order: 'date',
      maxResults: 1,
    });

    if (!res.data.items || res.data.items.length === 0) {
      throw new Error('No livestreams found');
    }

    const video = res.data.items[0];
    VIDEO_ID = video.id.videoId;
    console.log('✅ Latest stream video ID:', VIDEO_ID);
    
  } catch (error) {
    console.error('❌ YouTube API error:', error.message);
    throw error; // Propagate error to caller
  }
}
//VIDEO_ID = await getLatestLivestream();
await getLatestLivestream();

if(!VIDEO_ID) exit(1);

const wss = new WebSocketServer({ port: 8080 });
const CLIENT_VERSION = '2.20250606.01.00';
const CLIENT_NAME = 'WEB';

// Minimal clientContext for each POST
const clientContext = {
  client: {
    hl: 'en',
    gl: 'VN',
    clientName: CLIENT_NAME,
    clientVersion: CLIENT_VERSION
  },
  user: { lockedSafetyMode: false },
  request: { useSsl: true }
};

// Utility sleep
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// ——— Step 1: Fetch initial continuation token ———
async function fetchInitialContinuation(videoId) {
  const url = `https://www.youtube.com/live_chat?is_popout=1&v=${videoId}`;
  const resp = await axios.get(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/135.0.7049.116 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  const html = resp.data;
  // optional: dump to disk for debugging
  //await fs.writeFile('livechat.html', html);

  // pull out the reloadContinuationData token
  const m = html.match(/"reloadContinuationData":\{"continuation":"([^"]+)"/);
  if (!m) {
    throw new Error('Initial continuation token not found in HTML');
  }
  return m[1];
}

// ——— Step 2: Fetch one page of live chat ———
async function fetchLiveChatPage(continuation) {
  const url = `https://www.youtube.com/youtubei/v1/live_chat/get_live_chat?prettyPrint=false`;
  const body = { context: clientContext, continuation };
  const res = await axios.post(url, body, {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
  });

  if (res.status !== 200) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  return res.data;
}

// ——— Step 3: Stream indefinitely ———
async function streamLiveChat(videoId, callback) {
  let continuation = await fetchInitialContinuation(videoId);
  console.log(`→ Starting live chat stream; init token = ${continuation}`);
  let previousMessages = [];
  while (true) {
    try {
      const data = await fetchLiveChatPage(continuation);
      const live = data.continuationContents.liveChatContinuation;
      continuation = live.continuations[0].invalidationContinuationData.continuation;
      const newMessages = [];
      if ('actions' in live) {
        if (true) {
          for (let i = 0; i < live.actions.length; i++)
            if ('addChatItemAction' in live.actions[i]) {
              const action = live.actions[i];
              const msgR = action.addChatItemAction.item.liveChatTextMessageRenderer;
              const author = msgR.authorName.simpleText;
              let text = '';
              const runsItem = msgR.message.runs;
              if ('text' in runsItem[0]) {
                const text2 = runsItem.map(r => r.text).join('');
                const line = `{${msgR.id}} [${new Date().toISOString()}] ${author}: ${text2}`;
                newMessages.push(line);
                text = text2;
              } else if ('emoji' in runsItem[0]) {
                const text2 = runsItem[0].emoji.shortcuts[0];
                const line = `{${msgR.id}} [${new Date().toISOString()}] ${author}: ${text2}`;
                newMessages.push(line);
                text = text2;
              }
              const message = {
                id: msgR.id,
                author,
                text,
                timestamp: Date.now()
              };
              if (typeof callback === 'function') {
                callback(message);
              }
            } else if ('removeChatItemAction' in live.actions[i]) {
              console.log(`{rem:${live.actions.removeChatItemAction.targetItemId}}\n`);
            }
          const uniqueMessages = newMessages.filter(msg => !previousMessages.includes(msg));
          for (const line of uniqueMessages) {
            console.log(line);
          }
          previousMessages = newMessages;
        }
      }
      // 2) Get next continuation + timeout
      const contObj = live.continuations[0].invalidationContinuationData;
      continuation = contObj.continuation;
      // 3) Wait before next fetch
      await sleep(500);
    } catch (err) {
      //console.error('❌ Error:', err.message);
      //console.error(err.stack);
      await sleep(100);
    }
  }
}
//
// POST-PROCESSING
//
let rawFieldData = "{}";
let configFieldData = "{}";
let themeName = "red";
let processedCss = "";
let parsedData = {};

//Parsing .ini & renaming files.
/*
const ini = fs.readFileSync(`./themes/${themeName}/config.ini`, 'utf8');

// Split into lines, trim whitespace, ignore empty/comment lines
const lines = ini.split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith(';'));
const config = {};
let currentSection = null;
for (const line of lines) {
  if (line.startsWith('[') && line.endsWith(']')) {
    currentSection = line.slice(1, -1);
    config[currentSection] = {};
  } else if (currentSection && line.includes('=')) {
    const [key, value] = line.split('=').map(s => s.trim());
    config[currentSection][key] = value.replace(/^"|"$/g, ''); // remove quotes
  }
}
//console.log(config);
console.log(JSON.stringify(config));
*/
//Sending payload fieldsData
try {
  rawFieldData = await fs.readFile(`./themes/${themeName}/fields.txt`, 'utf-8');
} catch (e) {
  console.error("⚠️ Failed to load fields.txt:", e);
}

try {
  configFieldData = await fs.readFile(`./themes/${themeName}/data.json`, 'utf-8');
  parsedData = JSON.parse(configFieldData);
} catch (e) {
  console.error("⚠️ Failed to load data.json:", e);
}

try {
  const rawCss = await fs.readFile(`./themes/${themeName}/css.css`, 'utf-8');
  processedCss = rawCss.replace(/\{([\w-]+)\}/g, (_, key) => {
    const varName = key.replace(/-/g, '_'); // convert dash-keys
    return parsedData[key] || parsedData[varName] || 'transparent';
  });
} catch (e) {
  console.error("⚠️ Failed to load or process css.css:", e);
}

wss.on('connection', (client) => {
  // Send raw fieldData string
  client.send(JSON.stringify({
    type: 'configDataRaw',
    payload: configFieldData
  }));
  // Send raw configData string
  client.send(JSON.stringify({
    type: 'fieldDataRaw',
    payload: rawFieldData
  }));
  //Send processedCss
  client.send(JSON.stringify({
    type: 'processedCss',
    payload: processedCss
  }));

  console.log('Client connected.');
  client._isReady = true;
});



// Start YouTube crawler
streamLiveChat(VIDEO_ID, (message) => {
  // Broadcast messages to all connected clients
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

console.log('WebSocket server running on ws://localhost:8080');