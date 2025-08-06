import axios from 'axios';
import fs from 'fs/promises';

// ——— Your YouTube context ———
const VIDEO_ID = 'LuPtb6Xw-fE';
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
  await fs.writeFile('livechat.html', html);

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
async function streamLiveChat(videoId) {
  let continuation = await fetchInitialContinuation(videoId);
  console.log(`→ Starting live chat stream; init token = ${continuation}`);

  // ensure log file exists
  await fs.writeFile('chat.log', `--- Live Chat Log for ${videoId} ---\n`);

  let previousMessages = [];

  while (true) {
    try {
      const data = await fetchLiveChatPage(continuation);
      const live = data.continuationContents.liveChatContinuation;
      //console.log('>>>   Fetch finished!');
      //console.log(JSON.stringify(live));
      continuation = live.continuations[0].invalidationContinuationData.continuation;

      // 1) Print any new messages
      const newMessages = [];
      //const action of live.actions;
      if ('actions' in live) {
        //console.log('actions' in live, !("removeChatItemAction" in live.actions), live.actions.addChatItemAction);
        if (true) {// (!("removeChatItemAction" in live.actions) && live.actions.addChatItemAction) {
          for (let i = 0; i < live.actions.length; i++)
            if ('addChatItemAction' in live.actions[i]) {
              const action = live.actions[i];
              const msgR = action.addChatItemAction.item.liveChatTextMessageRenderer;
              const author = msgR.authorName.simpleText;
              //const badge = action.authorBadges[0].liveChatAuthorBadgeRenderer.icon.iconType;
              const runsItem = msgR.message.runs;
              if ('text' in runsItem[0]){
                const text = runsItem.map(r => r.text).join('');
                const line = `{${msgR.id}} [${new Date().toISOString()}] ${author}: ${text}`;
                newMessages.push(line);
              } else if ('emoji' in runsItem[0]){
                const text = runsItem[0].emoji.shortcuts[0];
                const line = `{${msgR.id}} [${new Date().toISOString()}] ${author}: ${text}`;
                newMessages.push(line);
              }
            } else if ('removeChatItemAction' in live.actions[i]) {
              console.log(`{rem:${live.actions.removeChatItemAction.targetItemId}}\n`);
              await fs.appendFile('chat.log', `{rem:${live.actions.removeChatItemAction.targetItemId}}\n`);
            }

          // Filter out duplicate messages
          const uniqueMessages = newMessages.filter(msg => !previousMessages.includes(msg));

          // Log unique messages
          for (const line of uniqueMessages) {
            console.log(line);
            await fs.appendFile('chat.log', line + '\n');
          }

          // Update previous messages
          previousMessages = newMessages;
        }
      }

      // 2) Get next continuation + timeout
      const contObj = live.continuations[0].invalidationContinuationData;
      continuation = contObj.continuation;
      const timeoutMs = parseInt(contObj.timeoutMs, 10);

      // 3) Wait before next fetch
      await sleep(timeoutMs);
      await fs.writeFile('actions.json', JSON.stringify(live));
    } catch (err) {
      //console.error('❌ Error:', err.message);
      //console.error(err.stack);
      // back off a few seconds, then retry
      await sleep(100);
    }
  }
}

// ——— Kick it off ———
streamLiveChat(VIDEO_ID).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
