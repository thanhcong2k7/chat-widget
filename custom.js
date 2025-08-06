const ws = new WebSocket('ws://localhost:8080');
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'delete') {
        // Handle message deletion
        $(`.message-row[data-msgid="${data.targetItemId}"]`).remove();
        return;
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
                    userId: data.author.toLowerCase(),
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