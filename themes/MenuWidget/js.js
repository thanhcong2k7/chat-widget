let totalMessages = 0
let messagesLimit = 30

function removeOldMessages() {
    if (totalMessages > messagesLimit) {
        document.getElementById(`m${x}`).remove()
        x++
    }
}
function parseBadges(badges) {
    if (!badges) return ""
    if (badges.length > 0) {
        return `<img src="${badges[0].url}" class="h-[16px]" />`
    }
    return ""
}


window.addEventListener("onEventReceived", async function (obj) {
    controller(obj.detail)
})

function controller(detail) {
  	console.log(detail);
    totalMessages++
    switch (detail.listener) {
        case "message":
            addMessage(detail.event.renderedText, detail.event.data.displayName, totalMessages, detail.event.data)
            break
        case "subscriber-latest":
            if (detail.event.isCommunityGift === true) return
            if (detail.event.bulkGifted === true) {
                addAlert(`${detail.event.amount} GIFTS`, detail.event.name, totalMessages, "GIFTS")
                break
            }
            if (detail.event.tier == "1000") {
                addAlert("1 subscription", detail.event.name, totalMessages, "SUB")
                break
            }
            if (detail.event.tier == "2000") {
                addAlert("1 T2 subscription", detail.event.name, totalMessages, "T2 SUB")
                break
            }
            if (detail.event.tier == "3000") {
                addAlert("1 T3 subscription", detail.event.name, totalMessages, "T3 SUB")
                break
            }
            if (detail.event.tier == "prime") {
                addAlert("1 Prime subscription", detail.event.name, totalMessages, "PRIME")
                break
            }
            break
        case "cheer-latest":
            addAlert(`${detail.event.amount} CHEER`, detail.event.name, totalMessages, "BITS")
            break
      	case "tip-latest":
            addAlert(`${detail.event.amount}$`, detail.event.name, totalMessages, "DONATION")
            break
    }
}
function addMessage(message, username, messageId, userInfo, timestamp) {
    function getCurrentTime() {
        const now = new Date()
        const options = {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }
        const time = now.toLocaleTimeString("en-US", options)
        return time
    }
    timestamp = getCurrentTime()
    const elem = document.createElement("div")
    elem.innerHTML = `<div class="message bg-[#eee3e0] w-[500px] paper bg-cover left-mask mb-1" id="m${messageId}">
    <div class="w-full h-full p-3">
        <div class="w-full h-[2px] bg-[#807775] mb-1.5 thatline1"></div>
            <div class="px-2 flex flex-col">
                <div style="font-family: 'Special Elite', serif" class="uppercase text-lg leading-[20px] flex flex-row justify-between">
                    <div id="username" class="h-[20px] flex flex-row gap-1 justify-center">${parseBadges(userInfo.badges)} ${username}</div>
                    <div class="text-xs flex flex-row gap-3 text-left"><div class="text-[8px] w-[160px]" style="letter-spacing: 1.5px;" id="dots">. . . . . . . . . . . . . . . . . . . .</div><div id="timestamp" class="w-[55px]">${timestamp}</div></div>
                </div>
                <div style="font-family: 'Montserrat'; word-break: break-word;" class="text-sm font-semibold flex flex-row flex-wrap gap-0.5" id="message">${message}</div>
            </div>
        <div class="w-full h-[2px] bg-[#807775] mt-1.5 thatline2"></div>
    </div>
</div>
`
    document.getElementById("main-container").appendChild(elem)
    const random = Math.floor(Math.random() * 99)
    console.log(messageId)
    document.getElementById(`m${messageId}`).style.backgroundPosition = `50% ${random}%`
    requestAnimationFrame(() => {
        const elem = document.getElementById(`m${messageId}`)
        const height = anime.get(elem, "height", "px")
        anime.timeline().add({
            targets: `#m${messageId}`,
            maxHeight: ["0px", height],
            opacity: [0, 1],
            duration: 500,
            easing: "easeOutExpo",
        })
        anime.timeline().add({
            targets: `#m${messageId}`,
            webkitMaskSize: ["0px", "500px"],
            maskSize: ["0px", "500px"],
            duration: 1200,
            delay: 300,
            easing: "easeOutExpo",
        })
        anime.timeline().add({
            targets: `#m${messageId} .thatline1`,
            width: ["0px", "100%"],
            duration: 1200,
            easing: "easeOutExpo",
            delay: 450,
        })
        anime.timeline().add({
            targets: `#m${messageId} .thatline2`,
            width: ["0px", "100%"],
            duration: 1200,
            easing: "easeOutExpo",
            delay: 500,
        })
        function writeOutText(id, delay) {
            const target = document.querySelector(`#m${messageId} #${id}`)
            const text = target.innerHTML
            const height = anime.get(target, "height", "px")
            target.style.height = height
            target.innerHTML = ""
            const emoteRegex = /<img[^>]*>/g
            const parts = text.split(emoteRegex)
            const emotes = text.match(emoteRegex) || []
            let index = 0
            function typeNextPart() {
                if (index < parts.length) {
                    const part = parts[index]
                    for (let i = 0; i < part.length; i++) {
                        setTimeout(() => {
                            target.innerHTML += part[i]
                        }, i * 50)
                    }
                    setTimeout(
                        () => {
                            if (emotes[index]) {
                                target.innerHTML += emotes[index]
                            }
                            index++
                            typeNextPart()
                        },
                        part.length * 50 + 50
                    )
                }
            }
            setTimeout(typeNextPart, delay)
        }
        writeOutText("username", 500)
        writeOutText("message", 500)
        writeOutText("timestamp", 2800)
        writeOutText("dots", 900)
    })
  
  removeOldMessages()
}
function addAlert(message, user, messageId, eventType = "SUB") {
    function getCurrentTime() {
        const now = new Date()
        const options = {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }
        const time = now.toLocaleTimeString("en-US", options)
        return time
    }
    var timestamp = getCurrentTime()
    let randomNum = Math.floor(Math.random() * 3) + 1
    const elem = document.createElement("div")
    elem.innerHTML = `<div class="w-[500px] flex flex-col mb-2 left-mask mb-3 uppercase" id="m${messageId}">
    <div class="message bg-[white] p-3 paper bg-white bg-top alert relative z-[100]">
        <div style="font-family: 'Special Elite', serif" class="uppercase text-lg leading-[20px] text-center">
            <div class="h-[20px]" id="order">ORDER: Table ${messageId}</div>
            <div class="text-sm leading-[16px] h-[16px]" id="please">PLEASE PAY SERVER</div>
            <div class="text-sm leading-[16px] h-[16px]" id="timestamp">${timestamp}</div>
        </div>
        <div class="h-[2px] bg-[#302b28] mt-1.5 mb-3 thatline"></div>
        <div class="flex flex-col items-center text-center px-6 font-semibold" style="font-family: 'Montserrat'">
            <div class="flex flex-row gap-2 w-full h-[24px]"><div class="w-[50%]" id="event">${message}</div><div class="w-[50%]" id="usernae">${user}</div></div>
        </div>
        <div class="text-center text-sm mt-1.5 h-[16px]" style="font-family: 'Special Elite', serif" id="thanku">THANK YOU FOR THE ${eventType}!</div>
    </div>
    <div class="w-full relative z-[10] h-[30px]">
      <div class="w-full absolute h-[60px] bg-cover -top-[25px] bg-bottom alert${randomNum}"></div>
    </div>
</div>
`
    document.getElementById("main-container").appendChild(elem)
    requestAnimationFrame(() => {
        const elem = document.getElementById(`m${messageId}`)
        const height = anime.get(elem, "height", "px")
        anime.timeline().add({
            targets: `#m${messageId}`,
            maxHeight: ["0px", height],
            opacity: [0, 1],
            duration: 500,
            easing: "easeOutExpo",
        })
        anime.timeline().add({
            targets: `#m${messageId}`,
            webkitMaskSize: ["0px", "500px"],
            maskSize: ["0px", "500px"],
            duration: 1200,
            delay: 500,
            easing: "easeOutExpo",
        })
        anime.timeline().add({
            targets: `#m${messageId} .thatline`,
            width: ["0px", "100%"],
            duration: 1200,
            easing: "easeOutExpo",
            delay: 1800,
        })
        function writeOutText(id, delay) {
            const target = document.querySelector(`#m${messageId} #${id}`)
            const text = target.innerHTML
            target.innerHTML = ""
            setTimeout(() => {
                for (let i = 0; i < text.length; i++) {
                    setTimeout(() => {
                        target.innerHTML += text[i]
                    }, i * 50)
                }
            }, delay)
        }
        writeOutText("order", 200)
        writeOutText("please", 1000)
        writeOutText("timestamp", 1500)
        writeOutText("event", 2000)
        writeOutText("usernae", 2500)
        writeOutText("thanku", 3000)
    })
  
  removeOldMessages();
}