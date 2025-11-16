var ws = new WebSocket();
// Source - https://stackoverflow.com/a
// Posted by freakish
// Retrieved 2025-11-16, License - CC BY-SA 3.0
ws.addEventListener("error", (event) => {
  console.log(">> WebSocket error: ", event);
});
var retry_connecting = function(domain, clb) {
    ws = new WebSocket(domain);
    ws.onerror = function() {
        console.log('WS Error! Retrying...');

        // let the client breath for 100 millis
        setTimeout(function() {
            retry_connecting(domain, clb);
        }, 1000);
    };
    ws.onopen = function() {
        clb(ws);
    };
};

retry_connecting('ws://localhost:8080', function(ws) {
    console.log('WS connected!');
});

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'delete') {
        // Handle message deletion
        $(`.message-row[data-msgid="${data.targetItemId}"]`).remove();
        return;
    }
    // Parse raw fieldData
    if (data.type === 'fieldDataRaw') {
        try {
            fieldData = JSON.parse(data.payload);
            currency = "$";
            nickColor = fieldData.nickColor || "#ffffff";
            nameColor = fieldData.namescolor || "#ffffff";
            hideCommands = fieldData.hideCommands || "no";
            channelName = "WS-Inject";
            msgAlign = fieldData.alignMessages || "bottom";
            msgHideOpt = fieldData.msgHideOpt || false;
            //initFromFieldData?.(); // Call post-setup hook
            console.log(">> fieldData loaded from raw string");
        } catch (err) {
            console.error("<< Failed to parse raw fieldData:", err);
        }
        return;
    }
    // Parse raw fieldData
    if (data.type === 'configDataRaw') {
        try {
            const parsed = JSON.parse(data.payload);
            for (const key in parsed) {
                if (Object.prototype.hasOwnProperty.call(parsed, key)) {
                    window[key] = parsed[key]; // ✅ creates global variable
                }
            }
            //initFromFieldData?.(); // Call post-setup hook
            console.log(">> configData loaded from raw string");
        } catch (err) {
            console.error("<< Failed to parse raw fieldData:", err);
        }
        return;
    }
    if (data.type === 'processedCss') {
        const styleEl = document.createElement('style');
        styleEl.textContent = data.payload;
        //https://fonts.googleapis.com/css?family=
        fetch(`https://fonts.googleapis.com/css?family=${msgFont}`)
            .then(response => response.text())
            .then(Response => {
                //console.log(Response);
                //document.head.appendChild(data);
                styleEl.textContent += Response;
            }).catch(err => { console.error(err); });
        document.head.appendChild(styleEl);
        console.log(">> Dynamic CSS injected.");
    }
    // Format for widget (mock Twitch-like structure)
    const mockEvent = {
        detail: {
            listener: "message",
            event: {
                service: "youtube",
                renderedText: data.text,
                data: {
                    nick: data.author,
                    userId: data.author?.toLowerCase(),
                    displayName: data.author,
                    text: data.text,
                    emotes: [],
                    msgId: data.id,
                    badges: [],
                    tags: {
                        badges: "" //Currently nothing
                    }
                }
            }
        }
    };

    // Trigger existing message handler
    window.dispatchEvent(new CustomEvent('onEventReceived', mockEvent));
};