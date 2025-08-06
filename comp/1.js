/* Copyright (C) 2023 Max @sigmacw_ and Matt @mattsquare_.
 *
 * You may not distribute this code without obtaining explicit permission
 * from Max @sigmacw_ and Matt @mattsquare_. 
 * 
 * All rights reserved.
 */

let ver = "1.0"

// Defining useful global variables
let msgLimit, hideAfter, hideCommands, provider, hasEmotes, widget_width;
let totalMsg = 0;
let ignoredUsers = [];
let commands = [];
let removeSelector;
let displayBadges = 'no';
let displayPronouns = 'no';
let displayUpdates = true
let colors_enabled = true
let test_streamer, test_mod, test_sub, test_reg;

let previousName = null;
let previousMsg = null;

let displayedMsg = []

let events = {
    cheer: {
        enabled: false,
        min: 1,
        class: "cheer"
    },
    tip: {
        enabled: false,
        min: 1,
        currency: "$",
        class: "tip"
    },
    sub: {
        enabled: false,
        class: "sub"
    },
    resub: {
        enabled: false,
        class: "resub"
    },
    gift: {
        enabled: false,
        class: "gift"
    },
    direct: {
        enabled: false,
        class: "direct"
    }
}


// Initial setup on widget startup
window.addEventListener('onWidgetLoad', async function (obj) {
    // Grabbing chat settings from fields
    console.log("Loaded!");
    const fieldData = obj.detail.fieldData;

    hideAfter = fieldData.hideAfter;
    msgLimit = fieldData.messagesLimit;
    hideCommands = fieldData.hideCommands;
    displayPronouns = fieldData.displayPronouns;

    events.cheer.enabled = fieldData.cheerEnabled;
    events.cheer.min = fieldData.cheerMin;

    events.tip.enabled = fieldData.tipEnabled;
    events.tip.min = fieldData.tipMin;
    events.tip.currency = fieldData.tipCurrency;

    events.sub.enabled = fieldData.subEnabled;

    events.resub.enabled = fieldData.resubEnabled;

    events.gift.enabled = fieldData.giftEnabled;

    events.direct.enabled = fieldData.directEnabled;

    widget_width = $(document).width();
    channelName = fieldData.testMessageName

    test_streamer = new CustomEvent("onEventReceived", {
        detail: {
            listener: "message",
            event: {
                service: "twitch",
                data: {
                    time: Date.now(),
                    tags: {
                        "badge-info": "",
                        badges: "broadcaster/1,subscriber/1",
                        color: "#5B99FF",
                        "display-name": "StreamElements",
                        emotes: "25:46-50",
                        flags: "",
                        id: "43285909-412c-4eee-b80d-89f72ba53142",
                        mod: "1",
                        "room-id": "85827806",
                        subscriber: "0",
                        "tmi-sent-ts": "1579444549265",
                        turbo: "0",
                        "user-id": "100135110",
                        "user-type": "mod"
                    },
                    nick: channelName,
                    userId: "100135110",
                    displayName: "Broadcaster",
                    displayColor: "#5B99FF",
                    badges: [{
                        type: "moderator",
                        version: "1",
                        url: "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3",
                        description: "Moderator"
                    }, {
                        type: "partner",
                        version: "1",
                        url: "https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3",
                        description: "Verified"
                    }],
                    channel: channelName,
                    text: "Check it out - only on Ko-Fi!",
                    isAction: !1,
                    emotes: [{
                        type: "twitch",
                        name: "Kappa",
                        id: "25",
                        gif: !1,
                        urls: {
                            1: "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
                            2: "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
                            4: "https://static-cdn.jtvnw.net/emoticons/v1/25/3.0"
                        },
                        start: 46,
                        end: 50
                    }],
                    msgId: ""
                },
                renderedText: 'Lorem Ipsum <img src="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 2x, https://static-cdn.jtvnw.net/emoticons/v1/25/3.0 4x" title="Kappa" class="emote"> Broadcaster Test'
            }
        }
    });

    test_mod = new CustomEvent("onEventReceived", {
        detail: {
            listener: "message",
            event: {
                service: "twitch",
                data: {
                    time: Date.now(),
                    tags: {
                        "badge-info": "",
                        badges: "moderator/1,partner/1",
                        color: "#5B99FF",
                        "display-name": "StreamElements",
                        emotes: "25:46-50",
                        flags: "",
                        id: "43285909-412c-4eee-b80d-89f72ba53142",
                        mod: "1",
                        "room-id": "85827806",
                        subscriber: "0",
                        "tmi-sent-ts": "1579444549265",
                        turbo: "0",
                        "user-id": "100135110",
                        "user-type": "mod"
                    },
                    nick: channelName,
                    userId: "100135110",
                    displayName: 'Moderator',
                    displayColor: "#5B99FF",
                    badges: [{
                        type: "moderator",
                        version: "1",
                        url: "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3",
                        description: "Moderator"
                    }, {
                        type: "partner",
                        version: "1",
                        url: "https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3",
                        description: "Verified"
                    }],
                    channel: channelName,
                    text: "Custom alert are here too! Chat can send you their love-letters.",
                    isAction: !1,
                    emotes: [],
                    msgId: ""
                },
                renderedText: 'Test message. <img src="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 2x, https://static-cdn.jtvnw.net/emoticons/v1/25/3.0 4x" title="Kappa" class="emote">'
            }
        }
    });

    test_sub = new CustomEvent("onEventReceived", {
        detail: {
            listener: "message",
            event: {
                service: "twitch",
                data: {
                    time: Date.now(),
                    tags: {
                        "badge-info": "",
                        badges: "subscriber/1",
                        color: "#5B99FF",
                        "display-name": "StreamElements",
                        emotes: "25:46-50",
                        flags: "",
                        id: "43285909-412c-4eee-b80d-89f72ba53142",
                        mod: "1",
                        "room-id": "85827806",
                        subscriber: "0",
                        "tmi-sent-ts": "1579444549265",
                        turbo: "0",
                        "user-id": "100135110",
                        "user-type": "mod"
                    },
                    nick: channelName,
                    userId: "100135110",
                    displayName: 'Subscriber',
                    displayColor: "#5B99FF",
                    badges: [{
                        type: "moderator",
                        version: "1",
                        url: "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3",
                        description: "Moderator"
                    }, {
                        type: "partner",
                        version: "1",
                        url: "https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3",
                        description: "Verified"
                    }],
                    channel: channelName,
                    text: "To celebrate, a Free to Use, Valentine's themed, hearty chat widget.",
                    isAction: !1,
                    emotes: [],
                    msgId: ""
                },
                renderedText: 'Test message. <img src="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 2x, https://static-cdn.jtvnw.net/emoticons/v1/25/3.0 4x" title="Kappa" class="emote">'
            }
        }
    });

    test_reg = new CustomEvent("onEventReceived", {
        detail: {
            listener: "message",
            event: {
                service: "twitch",
                data: {
                    time: Date.now(),
                    tags: {
                        "badge-info": "",
                        badges: "",
                        color: "#5B99FF",
                        "display-name": "StreamElements",
                        emotes: "25:46-50",
                        flags: "",
                        id: "43285909-412c-4eee-b80d-89f72ba53142",
                        mod: "1",
                        "room-id": "85827806",
                        subscriber: "0",
                        "tmi-sent-ts": "1579444549265",
                        turbo: "0",
                        "user-id": "100135110",
                        "user-type": "mod"
                    },
                    nick: channelName,
                    userId: "100135110",
                    displayName: channelName,
                    displayColor: "#5B99FF",
                    badges: [],
                    channel: channelName,
                    text: "Test message. Kappa",
                    isAction: !1,
                    emotes: [],
                    msgId: ""
                },
                renderedText: 'Test message. <img src="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 2x, https://static-cdn.jtvnw.net/emoticons/v1/25/3.0 4x" title="Kappa" class="emote">'
            }
        }
    });
    test_reg.detail.event.data.text = fieldData.testMessageText;

    // Grabbing the service used for chatbox (Twitch, YouTube, Mixer)
    fetch('https://api.streamelements.com/kappa/v2/channels/' + obj.detail.channel.id + '/')
        .then(response => response.json()).then((profile) => {
            provider = profile.provider;
        });

    removeSelector = ".message-row:nth-last-child(n+" + (msgLimit + 1) + ")"

    // Setting up the list of users whose messages will be ignored
    ignoredUsers = fieldData.ignoredUsers.toLowerCase()
        .replace(" ", "").split(",");
    commands = fieldData.ignoredCommands.toLowerCase()
        .replace(" ", "").split(",");
});

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
                data: {
                    nick: data.author,
                    userId: data.author.toLowerCase(),
                    displayName: data.author,
                    text: data.text,
                    emotes: [],
                    badges: ["subscriber"],
                    msgId: data.id,
                    tags: {
                        badges: "" // Thêm dòng này để tránh lỗi
                    }
                }
            }
        }
    };

    // Trigger existing message handler
    window.dispatchEvent(new CustomEvent('onEventReceived', mockEvent));
};

// Listen for StreamElements events
window.addEventListener('onEventReceived', function (obj) {
    // Define what to do on different events

    if (obj.detail.event.listener === 'widget-button') {
        switch (obj.detail.event.field) {
            case 'testMessage':
                test_streamer.detail.event.data.msgId = (Math.random() + 1).toString(36).substring(7) + (Math.random() + 1).toString(36).substring(7)
                window.dispatchEvent(test_streamer);
                break;
            case 'testMessage1':
                test_mod.detail.event.data.msgId = (Math.random() + 1).toString(36).substring(7) + (Math.random() + 1).toString(36).substring(7)
                window.dispatchEvent(test_mod);
                break
            case 'testMessage2':
                test_sub.detail.event.data.msgId = (Math.random() + 1).toString(36).substring(7) + (Math.random() + 1).toString(36).substring(7)
                window.dispatchEvent(test_sub);
                break
            case 'testMessage3':
                test_reg.detail.event.data.msgId = (Math.random() + 1).toString(36).substring(7) + (Math.random() + 1).toString(36).substring(7)
                window.dispatchEvent(test_reg);
                break
        }
    }

    // Check for events that correspond to message deletion
    if (obj.detail.listener === "delete-message") {
        const msgId = obj.detail.event.msgId;
        $(`.message-row[data-msgid=${msgId}]`).remove();
        return;
    } else if (obj.detail.listener === "delete-messages") {
        const sender = obj.detail.event.userId;
        $(`.message-row[data-sender=${sender}]`).remove();
        return;
    }

    if (obj.detail.listener === "cheer-latest") {
        let evt = obj.detail.event;
        let username = evt.name;
        let amount = evt.amount;
        if (amount < events.cheer.min || !events.cheer.enabled) {
            return
        }
        alertCheer(username, amount);
        return
    }

    if (obj.detail.listener === "tip-latest") {
        let evt = obj.detail.event;
        let username = evt.name;
        let amount = evt.amount;
        if (amount < events.tip.min || !events.tip.enabled) {
            return
        }
        alertTip(username, amount);
        return
    }

    if (obj.detail.listener === "subscriber-latest") {
        let evt = obj.detail.event;
        let username = evt.name;
        let amount = evt.amount;
        let bulkGifted = evt.bulkGifted;
        let sender = evt.sender;
        let isCommunityGift = false;
        isCommunityGift = evt.isCommunityGift;

        let gifted = false;
        gifted = evt.gifted;

        if (isCommunityGift) return;

        if (bulkGifted && events.gift.enabled) {
            alertBulkGift(username, amount);
        } else if (gifted && events.direct.enabled) {
            alertGift(sender, username);
        } else if (amount > 1 && events.resub.enabled) {
            alertReSub(username, amount);
        } else if (events.sub.enabled) {
            alertSub(username);
        }
        return;
    }

    // Check if the event is a chat message
    if (obj.detail.listener === "message") {
        let data = obj.detail.event.data;

        if (ignoredUsers.indexOf(data.nick) !== -1) {
            return;
        }
        console.log("Message here!");
        let role = check_role(data);
        let name = data.displayName;
        let message = attachEmotes(data);

        let badges = ``;
        if (displayBadges) {
            for (let i = 0; i < data.badges.length; i++) {
                badge = data.badges[i];
                badges += `<img alt="" src="${badge.url}" class="badge"> `;
            }
        }

        const emoteOnly = isEmote(data);

        const isCommand = commands.some(prefix => data.text.startsWith(prefix));
        if (isCommand && hideCommands === "yes") {
            return;
        }

        let pn = null;

        const pn_api = fetch('https://pronouns.alejo.io/api/users/' + data.displayName.toLowerCase())
            .then((response) => response.json())
            .then((user) => {
                if (!user.length) {
                    return null;
                } else return user[0].pronoun_id;
            });

        const printAddress = async () => {
            pn = await pn_api;
            switch (pn) {
                case "aeaer":
                    pn = "ae/aer";
                    break;
                case "eem":
                    pn = "e/em";
                    break;
                case "faefaer":
                    pn = "fae/faer";
                    break;
                case "hehim":
                    pn = "he/him";
                    break;
                case "heshe":
                    pn = "he/she";
                    break;
                case "hethem":
                    pn = "he/they";
                    break;
                case "itits":
                    pn = "it/its";
                    break;
                case "perper":
                    pn = "per/per";
                    break;
                case "sheher":
                    pn = "she/her";
                    break;
                case "shethem":
                    pn = "she/they";
                    break;
                case "theythem":
                    pn = "they/them";
                    break;
                case "vever":
                    pn = "ve/ver";
                    break;
                case "xexem":
                    pn = "xe/xem";
                    break;
                case "ziehir":
                    pn = "zie/hir";
                    break;
                default:
                    break;
            }
            return pn;
        }

        printAddress().then(pn => addMessage(name, null, role, badges, message, emoteOnly, data.isAction, data.userId, data.msgId, pn));
    }
});

// A function that renders the message in DOM
function addMessage(name, reply, badge, badges, message, isEmote, isAction, userId, msgId, pn) {
    // Advance the counter of total messages by 1 to keep track
    // of how many there are at any point
    totalMsg += 1;
    // Define a CSS class for a certain action
    const actionClass = isAction ? "action" : "";
    const emoteOnly = isEmote ? "emote-only" : "";

    let pn_none = ""
    if (!displayPronouns || pn == null) {
        pn_none = "style='display: none'"
    }

    const mentions = message.match(/@\S+/g)
    if (mentions) {
        for (var i = 0; i < mentions.length; i++) {
            message = message.replace(mentions[i], `<p style="color: #FFDEE6">${mentions[i]}</p>`)
        }
    }

    let roleIcon, broadcasterClass;

    broadcasterClass = '';
    let broadcasterBorder = '';
    let broadcasterFill = '';

    role = badge[0]
    switch (role) {
        case "broadcaster":
            roleIcon = `
            <div class="icon-role">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.125 5.53125V10.7812C10.125 11.0133 10.0328 11.2359 9.86872 11.4C9.70462 11.5641 9.48206 11.6562 9.25 11.6562H3.125C2.83773 11.6562 2.55328 11.5997 2.28788 11.4897C2.02248 11.3798 1.78133 11.2187 1.5782 11.0155C1.16797 10.6053 0.9375 10.0489 0.9375 9.46875V4.21875C0.9375 3.98669 1.02969 3.76413 1.19378 3.60003C1.35788 3.43594 1.58044 3.34375 1.8125 3.34375H7.9375C8.51766 3.34375 9.07406 3.57422 9.4843 3.98445C9.89453 4.39469 10.125 4.95109 10.125 5.53125ZM13.8438 4.49766C13.7778 4.45758 13.7022 4.43638 13.625 4.43638C13.5478 4.43638 13.4722 4.45758 13.4062 4.49766L11.2188 5.74453C11.1517 5.78326 11.0961 5.83911 11.0576 5.90637C11.0192 5.97362 10.9993 6.04988 11 6.12734V8.87266C10.9993 8.95012 11.0192 9.02637 11.0576 9.09363C11.0961 9.16089 11.1517 9.21674 11.2188 9.25547L13.4062 10.5023C13.4729 10.5406 13.5482 10.5613 13.625 10.5625C13.7019 10.562 13.7774 10.5413 13.8438 10.5023C13.9108 10.4649 13.9665 10.4102 14.005 10.3437C14.0435 10.2773 14.0634 10.2018 14.0625 10.125V4.875C14.0634 4.79824 14.0435 4.72267 14.005 4.65626C13.9665 4.58984 13.9108 4.53505 13.8438 4.49766Z" fill="#FF4976"/>
                </svg>
            </div>
            `
            broadcasterClass = 'white-border';
            broadcasterFill = 'white-fill';
            broadcasterBorder = 'style="border-right: solid 4px #FFDEE6 !important;"'
            break
        case "moderator":
            roleIcon = `
            <div class="icon-role">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M11.4219 12.8594C11.2448 12.8594 11.0755 12.8255 10.9141 12.7578C10.7526 12.6901 10.6042 12.5885 10.4688 12.4531L6.98437 8.9375C6.74479 9.02083 6.50521 9.08854 6.26562 9.14062C6.02604 9.19271 5.78125 9.21875 5.53125 9.21875C4.52083 9.21875 3.66146 8.86719 2.95312 8.16406C2.24479 7.46094 1.89062 6.60417 1.89062 5.59375C1.89062 5.27083 1.93229 4.95573 2.01562 4.64844C2.09896 4.34115 2.21875 4.05208 2.375 3.78125L4.64063 6.04688L6.07813 4.70313L3.75 2.375C4.02083 2.21875 4.30729 2.09635 4.60937 2.00781C4.91146 1.91927 5.21875 1.875 5.53125 1.875C6.5625 1.875 7.4401 2.23698 8.16406 2.96094C8.88802 3.6849 9.25 4.5625 9.25 5.59375C9.25 5.84375 9.22396 6.08854 9.17187 6.32812C9.11979 6.56771 9.05208 6.80729 8.96875 7.04687L12.4219 10.5C12.5573 10.6354 12.6589 10.7891 12.7266 10.9609C12.7943 11.1328 12.8281 11.3125 12.8281 11.5C12.8281 11.6875 12.7917 11.8672 12.7188 12.0391C12.6458 12.2109 12.5365 12.3594 12.3906 12.4844C12.2448 12.6094 12.0911 12.7031 11.9297 12.7656C11.7682 12.8281 11.599 12.8594 11.4219 12.8594Z"
                        fill="#FF4976" />
                </svg>
            </div>
            `
            break
        case "vip":
            roleIcon = `
            <div class="icon-role">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M5.22078 4.88542L6.75203 1.75H7.24787L8.77912 4.88542H5.22078ZM6.63537 11.8125L1.47287 5.61458H6.63537V11.8125ZM7.36454 11.8125V5.61458H12.527L7.36454 11.8125ZM9.59579 4.88542L8.06453 1.75H10.5437C10.709 1.75 10.8621 1.79375 11.0031 1.88125C11.144 1.96875 11.2534 2.08542 11.3312 2.23125L12.6437 4.88542H9.59579ZM1.3562 4.88542L2.6687 2.23125C2.74648 2.08542 2.85585 1.96875 2.99683 1.88125C3.1378 1.79375 3.29092 1.75 3.4562 1.75H5.93537L4.40412 4.88542H1.3562Z"
                        fill="#FF4976" />
                </svg>
            </div>
            `
            break
        case "artist":
            roleIcon = ``
            break
        case "subscriber":
            roleIcon = `
            <div class="icon-role">
                <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M11.7829 1.33822C11.4863 1.00543 11.1246 0.737114 10.7201 0.549909C10.3156 0.362704 9.8769 0.260603 9.4313 0.24994C8.98608 0.240181 8.54348 0.320399 8.13001 0.485787C7.71654 0.651175 7.34071 0.898329 7.02505 1.21244L6.50004 1.73197L6.08989 1.32728C4.81567 0.0475964 2.73755 -0.0617786 1.46333 1.09213C1.13172 1.38961 0.864266 1.75161 0.677335 2.15599C0.490403 2.56036 0.387917 2.99862 0.376144 3.44395C0.364371 3.88929 0.443558 4.33235 0.608862 4.74604C0.774167 5.15973 1.02211 5.53535 1.33755 5.84994L5.88208 10.3945C5.96293 10.4762 6.05918 10.541 6.16525 10.5852C6.27132 10.6295 6.38511 10.6523 6.50004 10.6523C6.61498 10.6523 6.72877 10.6295 6.83484 10.5852C6.94091 10.541 7.03716 10.4762 7.11801 10.3945L11.5477 5.96478C12.8274 4.69057 12.9313 2.61244 11.7829 1.33822Z"
                        fill="#FF4976" />
                </svg>
            </div>
            `
            break;
        default:
            roleIcon = ``
            break
    }

    name_ = name.concat("");

    let fullMsg = `
    <div data-sender="${userId}" data-msgid="${msgId}" class="message-row" id="msg-${totalMsg}">

        <div class="message-wrap">

            <div class="user-box">

                <div class="regular">
                    <svg width="14" height="27" viewBox="0 0 14 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M14 0V14.6716C14 15.202 13.7893 15.7107 13.4142 16.0858L3.41421 26.0858C2.15428 27.3457 0 26.4534 0 24.6716V0H14Z"
                            fill="#FFDEE6" />
                    </svg>
                </div>

                ${roleIcon}

                <div class="username">
                    <span class="username-text">${name}</span>
                    <span ${pn_none} class="divider"></span>
                    <span ${pn_none} class="pronouns">${pn}</span>
                </div>

                <div class="top-border">
                    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path class="${broadcasterClass}"
                            d="M9.35634 13.2437L14.4188 8.18121C15.6626 6.93121 15.8438 4.88746 14.6688 3.58121C14.3742 3.25203 14.0155 2.98639 13.6146 2.80052C13.2138 2.61464 12.7793 2.51244 12.3377 2.50016C11.8961 2.48787 11.4566 2.56576 11.046 2.72907C10.6355 2.89238 10.2626 3.13767 9.95009 3.44996L9.00009 4.40621L8.18134 3.58121C6.93134 2.33746 4.88759 2.15621 3.58134 3.33121C3.25215 3.62589 2.98651 3.98459 2.80064 4.3854C2.61476 4.78621 2.51256 5.22071 2.50028 5.66235C2.488 6.10398 2.56589 6.54349 2.72919 6.95401C2.8925 7.36453 3.13779 7.73744 3.45009 8.04996L8.64384 13.2437C8.73863 13.3376 8.86666 13.3903 9.00009 13.3903C9.13351 13.3903 9.26154 13.3376 9.35634 13.2437Z"
                            stroke="#FF4976" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                    <div class="separator-1 ${broadcasterClass}"></div>

                    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path class="${broadcasterFill}"
                            d="M16.5469 2.05466C16.1233 1.57925 15.6066 1.19594 15.0287 0.928502C14.4508 0.661066 13.8241 0.515208 13.1876 0.499975C12.5515 0.486034 11.9193 0.600631 11.3286 0.8369C10.7379 1.07317 10.201 1.42625 9.75006 1.87498L9.00006 2.61716L8.41413 2.03904C6.59381 0.210913 3.62506 0.0546631 1.80475 1.7031C1.33102 2.12808 0.948952 2.64522 0.681907 3.2229C0.414862 3.80058 0.268454 4.42666 0.251635 5.06285C0.234816 5.69905 0.347939 6.33199 0.584089 6.92297C0.820238 7.51396 1.17445 8.05056 1.62506 8.49998L8.11725 14.9922C8.23276 15.1089 8.37025 15.2015 8.52178 15.2647C8.67332 15.3279 8.83588 15.3605 9.00006 15.3605C9.16425 15.3605 9.32681 15.3279 9.47834 15.2647C9.62987 15.2015 9.76737 15.1089 9.88288 14.9922L16.211 8.66404C18.0391 6.84373 18.1876 3.87498 16.5469 2.05466Z"
                            fill="#FFAEC2" />
                    </svg>

                    <div class="separator-2 ${broadcasterClass}"></div>
                </div>

            </div>

            <div class="border"></div>

            <div ${broadcasterBorder} class="message-box">

                <div class="message-box__top-right">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path class="${broadcasterClass}" d="M2 2C10.8366 2 18 9.16344 18 18" stroke="#FF4976" stroke-width="4"
                            stroke-linecap="round" />
                    </svg>
                </div>

                <div class="message-box__bottom-right">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path class="${broadcasterClass}" d="M18 2C18 10.8366 10.8366 18 2 18" stroke="#FF4976" stroke-width="4"
                            stroke-linecap="round" />
                    </svg>
                </div>

                <div class="message ${emoteOnly}">
                    <p>${message}</p>
                </div>

                <div class="heart">
                    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M9.35634 13.2437L14.4188 8.18121C15.6626 6.93121 15.8438 4.88746 14.6688 3.58121C14.3742 3.25203 14.0155 2.98639 13.6146 2.80052C13.2138 2.61464 12.7793 2.51244 12.3377 2.50016C11.8961 2.48787 11.4566 2.56576 11.046 2.72907C10.6355 2.89238 10.2626 3.13767 9.95009 3.44996L9.00009 4.40621L8.18134 3.58121C6.93134 2.33746 4.88759 2.15621 3.58134 3.33121C3.25215 3.62589 2.98651 3.98459 2.80064 4.3854C2.61476 4.78621 2.51256 5.22071 2.50028 5.66235C2.488 6.10398 2.56589 6.54349 2.72919 6.95401C2.8925 7.36453 3.13779 7.73744 3.45009 8.04996L8.64384 13.2437C8.73863 13.3376 8.86666 13.3903 9.00009 13.3903C9.13351 13.3903 9.26154 13.3376 9.35634 13.2437Z"
                            stroke="#FFAEC2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>

                <div class="bottom-border">
                    <svg id="corner" width="20" height="20" viewBox="0 0 20 20" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path class="${broadcasterClass}" d="M18 18C9.16344 18 2 10.8366 2 2" stroke="#FF4976" stroke-width="4"
                            stroke-linecap="round" />
                    </svg>

                    <svg id="heart" width="18" height="16" viewBox="0 0 18 16" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path class="${broadcasterFill}"
                            d="M16.5469 2.05466C16.1233 1.57925 15.6066 1.19594 15.0287 0.928502C14.4508 0.661066 13.8241 0.515208 13.1876 0.499975C12.5515 0.486034 11.9193 0.600631 11.3286 0.8369C10.7379 1.07317 10.201 1.42625 9.75006 1.87498L9.00006 2.61716L8.41413 2.03904C6.59381 0.210913 3.62506 0.0546631 1.80475 1.7031C1.33102 2.12808 0.948952 2.64522 0.681907 3.2229C0.414862 3.80058 0.268454 4.42666 0.251635 5.06285C0.234816 5.69905 0.347939 6.33199 0.584089 6.92297C0.820238 7.51396 1.17445 8.05056 1.62506 8.49998L8.11725 14.9922C8.23276 15.1089 8.37025 15.2015 8.52178 15.2647C8.67332 15.3279 8.83588 15.3605 9.00006 15.3605C9.16425 15.3605 9.32681 15.3279 9.47834 15.2647C9.62987 15.2015 9.76737 15.1089 9.88288 14.9922L16.211 8.66404C18.0391 6.84373 18.1876 3.87498 16.5469 2.05466Z"
                            fill="#FFAEC2" />
                    </svg>

                    <div class="separator-2 ${broadcasterClass}"></div>
                </div>

            </div>

        </div>

    </div>
    `

    const element = (fullMsg);
    console.log(fullMsg);

    if (hideAfter !== 999) {
        $(element).appendTo('.main-container').delay(hideAfter * 1000).animate({
            opacity: 100
        }, 'fast', function () {
            $(element).remove();
        });
    } else {
        $(element).appendTo('.main-container');
    }

    // Removes messages if the total number 
    // of messages goes over the limit
    if (totalMsg > msgLimit) {
        removeRow();
    }
}

function appendAlert(block) {
    let alertTemplate = `
    <div class="message-row" id="msg-${totalMsg}">

        <div class="alert-borders">

            <div class="alert-wrap__top-right">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 2C10.8366 2 18 9.16344 18 18" stroke="#FFAEC2" stroke-width="4"
                        stroke-linecap="round" />
                </svg>
            </div>

            <div class="alert-wrap__top-left">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 18C2 9.16344 9.16344 2 18 2" stroke="#FFAEC2" stroke-width="4" stroke-linecap="round" />
                </svg>
            </div>

            <div class="alert-wrap__bottom-right">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 2C18 10.8366 10.8366 18 2 18" stroke="#FFAEC2" stroke-width="4"
                        stroke-linecap="round" />
                </svg>
            </div>

            <div class="alert-wrap__bottom-left">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 18C9.16344 18 2 10.8366 2 2" stroke="#FFAEC2" stroke-width="4"
                        stroke-linecap="round" />
                </svg>
            </div>

            <div class="alert-top-border">
                <div class="separator-1"></div>

                <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M9.35634 13.2437L14.4188 8.18121C15.6626 6.93121 15.8438 4.88746 14.6688 3.58121C14.3742 3.25203 14.0155 2.98639 13.6146 2.80052C13.2138 2.61464 12.7793 2.51244 12.3377 2.50016C11.8961 2.48787 11.4566 2.56576 11.046 2.72907C10.6355 2.89238 10.2626 3.13767 9.95009 3.44996L9.00009 4.40621L8.18134 3.58121C6.93134 2.33746 4.88759 2.15621 3.58134 3.33121C3.25215 3.62589 2.98651 3.98459 2.80064 4.3854C2.61476 4.78621 2.51256 5.22071 2.50028 5.66235C2.488 6.10398 2.56589 6.54349 2.72919 6.95401C2.8925 7.36453 3.13779 7.73744 3.45009 8.04996L8.64384 13.2437C8.73863 13.3376 8.86666 13.3903 9.00009 13.3903C9.13351 13.3903 9.26154 13.3376 9.35634 13.2437Z"
                        stroke="#FFAEC2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                <div class="separator-2"></div>

                <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M16.5469 2.05466C16.1233 1.57925 15.6066 1.19594 15.0287 0.928502C14.4508 0.661066 13.8241 0.515208 13.1876 0.499975C12.5515 0.486034 11.9193 0.600631 11.3286 0.8369C10.7379 1.07317 10.201 1.42625 9.75006 1.87498L9.00006 2.61716L8.41413 2.03904C6.59381 0.210913 3.62506 0.0546631 1.80475 1.7031C1.33102 2.12808 0.948952 2.64522 0.681907 3.2229C0.414862 3.80058 0.268454 4.42666 0.251635 5.06285C0.234816 5.69905 0.347939 6.33199 0.584089 6.92297C0.820238 7.51396 1.17445 8.05056 1.62506 8.49998L8.11725 14.9922C8.23276 15.1089 8.37025 15.2015 8.52178 15.2647C8.67332 15.3279 8.83588 15.3605 9.00006 15.3605C9.16425 15.3605 9.32681 15.3279 9.47834 15.2647C9.62987 15.2015 9.76737 15.1089 9.88288 14.9922L16.211 8.66404C18.0391 6.84373 18.1876 3.87498 16.5469 2.05466Z"
                        fill="#FFAEC2" />
                </svg>

                <div class="separator-3"></div>
            </div>

            <div class="alert-bottom-border">
                <div class="separator-1"></div>

                <svg id="heart" width="18" height="16" viewBox="0 0 18 16" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M9.35634 13.2437L14.4188 8.18121C15.6626 6.93121 15.8438 4.88746 14.6688 3.58121C14.3742 3.25203 14.0155 2.98639 13.6146 2.80052C13.2138 2.61464 12.7793 2.51244 12.3377 2.50016C11.8961 2.48787 11.4566 2.56576 11.046 2.72907C10.6355 2.89238 10.2626 3.13767 9.95009 3.44996L9.00009 4.40621L8.18134 3.58121C6.93134 2.33746 4.88759 2.15621 3.58134 3.33121C3.25215 3.62589 2.98651 3.98459 2.80064 4.3854C2.61476 4.78621 2.51256 5.22071 2.50028 5.66235C2.488 6.10398 2.56589 6.54349 2.72919 6.95401C2.8925 7.36453 3.13779 7.73744 3.45009 8.04996L8.64384 13.2437C8.73863 13.3376 8.86666 13.3903 9.00009 13.3903C9.13351 13.3903 9.26154 13.3376 9.35634 13.2437Z"
                        stroke="#FFAEC2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                <div class="separator-2"></div>
            </div>

            <div class="alert-left-border">
                <div class="separator-1"></div>

                <svg id="heart" width="18" height="16" viewBox="0 0 18 16" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M9.35634 13.2437L14.4188 8.18121C15.6626 6.93121 15.8438 4.88746 14.6688 3.58121C14.3742 3.25203 14.0155 2.98639 13.6146 2.80052C13.2138 2.61464 12.7793 2.51244 12.3377 2.50016C11.8961 2.48787 11.4566 2.56576 11.046 2.72907C10.6355 2.89238 10.2626 3.13767 9.95009 3.44996L9.00009 4.40621L8.18134 3.58121C6.93134 2.33746 4.88759 2.15621 3.58134 3.33121C3.25215 3.62589 2.98651 3.98459 2.80064 4.3854C2.61476 4.78621 2.51256 5.22071 2.50028 5.66235C2.488 6.10398 2.56589 6.54349 2.72919 6.95401C2.8925 7.36453 3.13779 7.73744 3.45009 8.04996L8.64384 13.2437C8.73863 13.3376 8.86666 13.3903 9.00009 13.3903C9.13351 13.3903 9.26154 13.3376 9.35634 13.2437Z"
                        stroke="#FFAEC2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                <div class="separator-2"></div>
            </div>

        </div>

        <div class="alert-wrap">

            <div class="background">
                <svg width="436" height="110" viewBox="0 0 436 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.24">
                        <mask id="mask0_83_171" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="-1"
                            width="436" height="111">
                            <rect width="436" height="110" rx="16" transform="matrix(1 0 0 -1 0 110)"
                                fill="url(#paint0_radial_83_171)" />
                        </mask>
                        <g mask="url(#mask0_83_171)">
                            <path opacity="0.2"
                                d="M151.777 13.3644L109.835 53.9795L88.8807 57.1398L36.8265 30.7007L88.5228 -16.2841L151.777 13.3644Z"
                                fill="#FFAEC2" />
                            <path
                                d="M36.8265 30.7007L46.217 92.9653C46.4086 94.2356 47.0969 95.3778 48.1306 96.1405C49.1643 96.9033 50.4587 97.2241 51.7289 97.0326L157.1 81.1409C158.37 80.9494 159.512 80.261 160.275 79.2273C161.038 78.1936 161.359 76.8993 161.167 75.629L151.777 13.3644L88.5228 -16.2841L36.8265 30.7007Z"
                                stroke="#FFAEC2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M88.8807 57.1398L48.2284 96.1522" stroke="#FFAEC2" stroke-width="4"
                                stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M160.185 79.2674L109.835 53.9796" stroke="#FFAEC2" stroke-width="4"
                                stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M151.777 13.3645L109.835 53.9796L88.8808 57.1399L36.8265 30.7008"
                                stroke="#FFAEC2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                            <path opacity="0.2"
                                d="M381.454 60.6293L307.707 104.525L276.662 101.95L211.154 46.5041L301.013 -3.19986L381.454 60.6293Z"
                                fill="#FFAEC2" />
                            <path
                                d="M211.154 46.5041L203.503 138.75C203.347 140.632 203.945 142.499 205.165 143.94C206.386 145.381 208.129 146.278 210.011 146.434L366.119 159.382C368.001 159.538 369.867 158.94 371.309 157.72C372.75 156.5 373.647 154.757 373.803 152.875L381.454 60.6293L301.013 -3.19986L211.154 46.5041Z"
                                stroke="#FFAEC2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M276.662 101.95L205.301 143.989" stroke="#FFAEC2" stroke-width="4"
                                stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M371.166 157.747L307.706 104.525" stroke="#FFAEC2" stroke-width="4"
                                stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M381.454 60.6292L307.706 104.525L276.662 101.95L211.154 46.504"
                                stroke="#FFAEC2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                            <path
                                d="M405.251 44.1189L418.499 31.983C421.754 28.9858 422.433 23.8821 419.63 20.4784C418.928 19.6208 418.058 18.9154 417.073 18.4055C416.089 17.8955 415.011 17.5916 413.905 17.5123C412.799 17.4331 411.689 17.5801 410.642 17.9444C409.595 18.3088 408.633 18.8828 407.815 19.6314L405.328 21.9244L403.366 19.7663C400.369 16.5111 395.265 15.8324 391.862 18.6347C391.004 19.3373 390.299 20.2074 389.789 21.1918C389.279 22.1762 388.975 23.2543 388.896 24.3601C388.816 25.4659 388.963 26.5763 389.328 27.6234C389.692 28.6705 390.266 29.6323 391.015 30.4501L403.465 44.0407C403.693 44.2865 404.008 44.4326 404.342 44.4472C404.677 44.4618 405.004 44.3438 405.251 44.1189Z"
                                stroke="#FFAEC2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                            <path
                                d="M414.593 79.098L420.493 73.6925C421.943 72.3576 422.245 70.0843 420.997 68.5683C420.684 68.1863 420.296 67.8721 419.858 67.645C419.42 67.4178 418.939 67.2825 418.447 67.2472C417.954 67.2119 417.46 67.2773 416.993 67.4396C416.527 67.6019 416.099 67.8576 415.734 68.191L414.627 69.2124L413.753 68.2511C412.418 66.8012 410.145 66.4989 408.629 67.7471C408.247 68.06 407.932 68.4476 407.705 68.886C407.478 69.3245 407.343 69.8047 407.307 70.2972C407.272 70.7898 407.338 71.2844 407.5 71.7507C407.662 72.2171 407.918 72.6455 408.251 73.0098L413.797 79.0632C413.898 79.1727 414.039 79.2377 414.188 79.2442C414.337 79.2508 414.482 79.1982 414.593 79.098Z"
                                stroke="#FFAEC2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                            <path
                                d="M19.4176 95.6223L24.9223 88.556C26.2738 86.8122 26.1836 84.2467 24.5233 82.8061C24.1066 82.4428 23.6203 82.1683 23.094 81.9994C22.5677 81.8304 22.0125 81.7705 21.4622 81.8234C20.912 81.8763 20.3783 82.0408 19.8938 82.3068C19.4093 82.5729 18.9841 82.935 18.6443 83.3709L17.6123 84.7047L16.4685 83.8067C14.7247 82.4552 12.1592 82.5454 10.7186 84.2057C10.3554 84.6223 10.0809 85.1087 9.91189 85.635C9.74293 86.1613 9.68305 86.7165 9.73591 87.2667C9.78877 87.817 9.95326 88.3506 10.2193 88.8351C10.4854 89.3197 10.8475 89.7448 11.2834 90.0847L18.5329 95.7322C18.6651 95.8341 18.8322 95.8798 18.9979 95.8592C19.1635 95.8386 19.3143 95.7535 19.4176 95.6223Z"
                                stroke="#FFAEC2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                    </g>
                    <defs>
                        <radialGradient id="paint0_radial_83_171" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                            gradientTransform="translate(236 123.5) rotate(-89.5772) scale(135.504 537.087)">
                            <stop stop-color="white" stop-opacity="0" />
                            <stop offset="1" stop-color="white" />
                        </radialGradient>
                    </defs>
                </svg>
            </div>

            <div class="left-detail">
                <svg width="22" height="30" viewBox="0 0 22 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.154 28L20 25.2201M2 15L18.9089 15M14.1538 2L19.9998 4.77995" stroke="#FFDEE6"
                        stroke-width="4" stroke-linecap="round" />
                </svg>
            </div>

            ${block}

            <div class="right-detail">
                <svg width="22" height="30" viewBox="0 0 22 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.84598 28L2 25.2201M20 15L3.09107 15M7.84621 2L2.00023 4.77995" stroke="#FFDEE6"
                        stroke-width="4" stroke-linecap="round" />
                </svg>
            </div>

        </div>

    </div>
    `

    let element;
    element = $.parseHTML(alertTemplate);

    if (hideAfter !== 999) {
        $(element).appendTo('.main-container').delay(hideAfter * 1000).animate({
            opacity: 0
        }, 'fast', function () {
            $(element).remove();
        });
    } else {
        $(element).appendTo('.main-container');
    }

    // Removes messages if the total number 
    // of messages goes over the limit
    if (totalMsg > msgLimit) {
        removeRow();
    }
}


function alertSub(username) {
    totalMsg += 1;
    let block_to_append = `
	<div class="alert-message">

        <div class="header">
            <div class="heart-bubble">
                <svg width="13" height="11" viewBox="0 0 13 11" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M11.7829 1.33822C11.4863 1.00543 11.1246 0.737114 10.7201 0.549909C10.3156 0.362704 9.8769 0.260603 9.4313 0.24994C8.98608 0.240181 8.54348 0.320399 8.13001 0.485787C7.71654 0.651175 7.34071 0.898329 7.02505 1.21244L6.50004 1.73197L6.08989 1.32728C4.81567 0.0475964 2.73755 -0.0617786 1.46333 1.09213C1.13172 1.38961 0.864266 1.75161 0.677335 2.15599C0.490403 2.56036 0.387917 2.99862 0.376144 3.44395C0.364371 3.88929 0.443558 4.33235 0.608862 4.74604C0.774167 5.15973 1.02211 5.53535 1.33755 5.84994L5.88208 10.3945C5.96293 10.4762 6.05918 10.541 6.16525 10.5852C6.27132 10.6295 6.38511 10.6523 6.50004 10.6523C6.61498 10.6523 6.72877 10.6295 6.83484 10.5852C6.94091 10.541 7.03716 10.4762 7.11801 10.3945L11.5477 5.96478C12.8274 4.69057 12.9313 2.61244 11.7829 1.33822Z"
                        fill="#FF4976" />
                </svg>
            </div>
            <div class="chevron">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.5 1.99976L6 4.49976L3.5 6.99976" stroke="#FFDEE6" stroke-width="4"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>

            <div class="username">
                <p class="alert-username">${username}</p>
            </div>
        </div>

        <p>Thank you for the sub!</p>

    </div>
    `

    appendAlert(block_to_append)
}

function alertReSub(username, amount) {
    totalMsg += 1;
    let block_to_append = `
    <div class="alert-message">

        <div class="header">
            <div class="heart-bubble">
                <svg width="13" height="11" viewBox="0 0 13 11" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M11.7829 1.33822C11.4863 1.00543 11.1246 0.737114 10.7201 0.549909C10.3156 0.362704 9.8769 0.260603 9.4313 0.24994C8.98608 0.240181 8.54348 0.320399 8.13001 0.485787C7.71654 0.651175 7.34071 0.898329 7.02505 1.21244L6.50004 1.73197L6.08989 1.32728C4.81567 0.0475964 2.73755 -0.0617786 1.46333 1.09213C1.13172 1.38961 0.864266 1.75161 0.677335 2.15599C0.490403 2.56036 0.387917 2.99862 0.376144 3.44395C0.364371 3.88929 0.443558 4.33235 0.608862 4.74604C0.774167 5.15973 1.02211 5.53535 1.33755 5.84994L5.88208 10.3945C5.96293 10.4762 6.05918 10.541 6.16525 10.5852C6.27132 10.6295 6.38511 10.6523 6.50004 10.6523C6.61498 10.6523 6.72877 10.6295 6.83484 10.5852C6.94091 10.541 7.03716 10.4762 7.11801 10.3945L11.5477 5.96478C12.8274 4.69057 12.9313 2.61244 11.7829 1.33822Z"
                        fill="#FF4976" />
                </svg>
            </div>
            <div class="chevron">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.5 1.99976L6 4.49976L3.5 6.99976" stroke="#FFDEE6" stroke-width="4"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>

            <div class="username">
                <p class="alert-username">${username}</p>
            </div>
        </div>

        <p>Resubscribed for ${amount} months!</p>

    </div>
    `

    appendAlert(block_to_append)
}

function alertBulkGift(username, amount) {
    totalMsg += 1;
    let block_to_append = `
	<div class="alert-message">

        <div class="header">
            <div class="heart-bubble">
                <svg width="13" height="11" viewBox="0 0 13 11" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M11.7829 1.33822C11.4863 1.00543 11.1246 0.737114 10.7201 0.549909C10.3156 0.362704 9.8769 0.260603 9.4313 0.24994C8.98608 0.240181 8.54348 0.320399 8.13001 0.485787C7.71654 0.651175 7.34071 0.898329 7.02505 1.21244L6.50004 1.73197L6.08989 1.32728C4.81567 0.0475964 2.73755 -0.0617786 1.46333 1.09213C1.13172 1.38961 0.864266 1.75161 0.677335 2.15599C0.490403 2.56036 0.387917 2.99862 0.376144 3.44395C0.364371 3.88929 0.443558 4.33235 0.608862 4.74604C0.774167 5.15973 1.02211 5.53535 1.33755 5.84994L5.88208 10.3945C5.96293 10.4762 6.05918 10.541 6.16525 10.5852C6.27132 10.6295 6.38511 10.6523 6.50004 10.6523C6.61498 10.6523 6.72877 10.6295 6.83484 10.5852C6.94091 10.541 7.03716 10.4762 7.11801 10.3945L11.5477 5.96478C12.8274 4.69057 12.9313 2.61244 11.7829 1.33822Z"
                        fill="#FF4976" />
                </svg>
            </div>
            <div class="chevron">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.5 1.99976L6 4.49976L3.5 6.99976" stroke="#FFDEE6" stroke-width="4"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>

            <div class="username">
                <p class="alert-username">${username}</p>
            </div>
        </div>

        <p>Gifted ${amount} subs to the community!</p>

    </div>
    `

    appendAlert(block_to_append)
}

function alertGift(sender, target) {
    totalMsg += 1;
    let block_to_append = `
    <div class="alert-message">

        <div class="header">
            <div class="heart-bubble">
                <svg width="13" height="11" viewBox="0 0 13 11" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M11.7829 1.33822C11.4863 1.00543 11.1246 0.737114 10.7201 0.549909C10.3156 0.362704 9.8769 0.260603 9.4313 0.24994C8.98608 0.240181 8.54348 0.320399 8.13001 0.485787C7.71654 0.651175 7.34071 0.898329 7.02505 1.21244L6.50004 1.73197L6.08989 1.32728C4.81567 0.0475964 2.73755 -0.0617786 1.46333 1.09213C1.13172 1.38961 0.864266 1.75161 0.677335 2.15599C0.490403 2.56036 0.387917 2.99862 0.376144 3.44395C0.364371 3.88929 0.443558 4.33235 0.608862 4.74604C0.774167 5.15973 1.02211 5.53535 1.33755 5.84994L5.88208 10.3945C5.96293 10.4762 6.05918 10.541 6.16525 10.5852C6.27132 10.6295 6.38511 10.6523 6.50004 10.6523C6.61498 10.6523 6.72877 10.6295 6.83484 10.5852C6.94091 10.541 7.03716 10.4762 7.11801 10.3945L11.5477 5.96478C12.8274 4.69057 12.9313 2.61244 11.7829 1.33822Z"
                        fill="#FF4976" />
                </svg>
            </div>
            <div class="chevron">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.5 1.99976L6 4.49976L3.5 6.99976" stroke="#FFDEE6" stroke-width="4"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>

            <div class="username">
                <p class="alert-username">${sender}</p>
            </div>
        </div>

        <p>Gifted ${target} a sub!</p>

    </div>
    `

    appendAlert(block_to_append)
}

function alertCheer(username, amount) {
    totalMsg += 1;
    let block_to_append = `
    <div class="alert-message">

        <div class="header">
            <div class="heart-bubble">
                <svg width="13" height="11" viewBox="0 0 13 11" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M11.7829 1.33822C11.4863 1.00543 11.1246 0.737114 10.7201 0.549909C10.3156 0.362704 9.8769 0.260603 9.4313 0.24994C8.98608 0.240181 8.54348 0.320399 8.13001 0.485787C7.71654 0.651175 7.34071 0.898329 7.02505 1.21244L6.50004 1.73197L6.08989 1.32728C4.81567 0.0475964 2.73755 -0.0617786 1.46333 1.09213C1.13172 1.38961 0.864266 1.75161 0.677335 2.15599C0.490403 2.56036 0.387917 2.99862 0.376144 3.44395C0.364371 3.88929 0.443558 4.33235 0.608862 4.74604C0.774167 5.15973 1.02211 5.53535 1.33755 5.84994L5.88208 10.3945C5.96293 10.4762 6.05918 10.541 6.16525 10.5852C6.27132 10.6295 6.38511 10.6523 6.50004 10.6523C6.61498 10.6523 6.72877 10.6295 6.83484 10.5852C6.94091 10.541 7.03716 10.4762 7.11801 10.3945L11.5477 5.96478C12.8274 4.69057 12.9313 2.61244 11.7829 1.33822Z"
                        fill="#FF4976" />
                </svg>
            </div>
            <div class="chevron">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.5 1.99976L6 4.49976L3.5 6.99976" stroke="#FFDEE6" stroke-width="4"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>

            <div class="username">
                <p class="alert-username">${username}</p>
            </div>
        </div>

        <p>Thank you for ${amount} bits!</p>

    </div>
    `

    appendAlert(block_to_append)
}

function alertTip(username, amount) {
    totalMsg += 1;
    let block_to_append = `
    <div class="alert-message">

        <div class="header">
            <div class="heart-bubble">
                <svg width="13" height="11" viewBox="0 0 13 11" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M11.7829 1.33822C11.4863 1.00543 11.1246 0.737114 10.7201 0.549909C10.3156 0.362704 9.8769 0.260603 9.4313 0.24994C8.98608 0.240181 8.54348 0.320399 8.13001 0.485787C7.71654 0.651175 7.34071 0.898329 7.02505 1.21244L6.50004 1.73197L6.08989 1.32728C4.81567 0.0475964 2.73755 -0.0617786 1.46333 1.09213C1.13172 1.38961 0.864266 1.75161 0.677335 2.15599C0.490403 2.56036 0.387917 2.99862 0.376144 3.44395C0.364371 3.88929 0.443558 4.33235 0.608862 4.74604C0.774167 5.15973 1.02211 5.53535 1.33755 5.84994L5.88208 10.3945C5.96293 10.4762 6.05918 10.541 6.16525 10.5852C6.27132 10.6295 6.38511 10.6523 6.50004 10.6523C6.61498 10.6523 6.72877 10.6295 6.83484 10.5852C6.94091 10.541 7.03716 10.4762 7.11801 10.3945L11.5477 5.96478C12.8274 4.69057 12.9313 2.61244 11.7829 1.33822Z"
                        fill="#FF4976" />
                </svg>
            </div>
            <div class="chevron">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.5 1.99976L6 4.49976L3.5 6.99976" stroke="#FFDEE6" stroke-width="4"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>

            <div class="username">
                <p class="alert-username">${username}</p>
            </div>
        </div>

        <p>Thank you for ${events.tip.currency}${amount}</p>

    </div>
    `

    appendAlert(block_to_append)
}

// A set of helper functions to handle emotes
function attachEmotes(message) {
    let text = html_encode(message.text);
    let data = message.emotes;
    if (data[0]) {
        hasEmotes = "has-emotes"
    } else {
        hasEmotes = ""
    }
    let isEmoteOnly = isEmote(message)
    if (typeof message.attachment !== "undefined") {
        if (typeof message.attachment.media !== "undefined") {
            if (typeof message.attachment.media.image !== "undefined") {
                text = `${message.text}<img src="${message.attachment.media.image.src}">`;
            }
        }
    }
    return text
        .replace(
            /([^\s]*)/gi,
            function (m, key) {
                let result = data.filter(emote => {
                    return html_encode(emote.name) === key
                });
                if (typeof result[0] !== "undefined") {
                    let url;
                    if (isEmoteOnly) {
                        url = result[0]['urls'][4];
                    } else {
                        url = result[0]['urls'][1];
                    }
                    if (provider === "twitch") {
                        return `<img class="emote" src="${url}"/>`;
                    } else {
                        if (typeof result[0].coords === "undefined") {
                            result[0].coords = {
                                x: 0,
                                y: 0
                            };
                        }
                        let x = parseInt(result[0].coords.x);
                        let y = parseInt(result[0].coords.y);

                        let width = "28px";
                        let height = "auto";

                        if (provider === "mixer") {
                            if (result[0].coords.width) {
                                width = `${result[0].coords.width}px`;
                            }
                            if (result[0].coords.height) {
                                height = `${result[0].coords.height}px`;
                            }
                        }
                        return `<div class="emote" style="width: ${width}; height:${height}; display: inline-block; background-image: url(${url}); background-position: -${x}px -${y}px;"></div>`;
                    }
                } else return key;

            }
        );
}

function html_encode(e) {
    return e.replace(/[<>"^]/g, function (e) {
        return "&#" + e.charCodeAt(0) + ";";
    });
}

function check_role(data) {
    let role
    let badges = data.tags.badges;
    if (badges.includes('broadcaster')) {
        role = 'broadcaster'
    } else if (badges.includes('moderator')) {
        role = 'moderator'
    } else if (badges.includes('vip')) {
        role = 'vip'
    } else if (badges.includes('artist-badge')) {
        role = 'artist'
    } else if (badges.includes('subscriber')) {
        role = 'subscriber'
    }

    let isSub = false
    if (badges.includes('subscriber')) {
        isSub = true
    }

    return [role, isSub]
}

function removeRow() {
    if (!$(removeSelector).length) {
        return;
    }

    $(removeSelector).stop(true)

    $(removeSelector).animate({
        opacity: 0
    }, 'fast', function () {
        $(removeSelector).remove();
    });
}

function isEmote(data) {
    let msg = data.text;
    msg = msg.replace(/\s\s+/g, ' ');
    let msg_split = msg.split(" ");

    let emotes = data.emotes;

    let emoteOnly = true;
    const emote_names = emotes.map((e) => e.name);

    for (let i = 0; i < msg_split.length; i++) {
        if (!emote_names.includes(msg_split[i])) {
            emoteOnly = false
        }
    }
    return emoteOnly;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}