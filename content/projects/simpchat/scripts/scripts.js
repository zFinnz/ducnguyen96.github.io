const connectToNameSpace = (ns) => {
  socket = io(`https://ducnguyen96.xyz:${ns === "tech" ? 3003 : 3002}/${ns}`, {
    transports: ["wss", "ws"],
    query: {
      token: `${document.cookie.split("=")[1]}`,
    },
  });

  socket.on("connect", function () {
    console.log(`connected to ${ns}`);
    rooms(ns.toUpperCase());
  });

  const roomBody = document.querySelector(".card-body.msg_card_body");

  roomBody.scrollTo(0, roomBody.scrollHeight);
  socket.on("left", (data) => {
    const messageElem = document.createElement("p");
    messageElem.style.color = "rgba(255,255,255,0.5)";
    messageElem.style.textAlign = "center";
    messageElem.style.fontSize = "12px";
    messageElem.innerHTML = data.message;
    roomBody.appendChild(messageElem);

    roomBody.scrollTo(0, roomBody.scrollHeight);
  });

  socket.on("joined", (data) => {
    const messageElem = document.createElement("p");
    messageElem.style.color = "rgba(255,255,255,0.5)";
    messageElem.style.textAlign = "center";
    messageElem.style.fontSize = "12px";
    messageElem.innerHTML = data.message;
    roomBody.appendChild(messageElem);

    roomBody.scrollTo(0, roomBody.scrollHeight);
  });

  // send message
  const roomFooter = document.querySelector(".card-footer .input-group");
  const clickBtn = roomFooter.querySelector(".input-group-append");
  const footerText = roomFooter.querySelector("textarea");
  footerText.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      event.preventDefault();
      clickBtn.click();
      footerText.value = "";
    }
  });

  clickBtn.addEventListener("click", () => {
    const messageDOM = roomFooter.querySelector(".input-group textarea");
    const message = messageDOM.value;

    if (message === "") {
      return;
    }

    const activeRoom = document.querySelector("ui.contacts li.active");
    socket.emit("client_send_message", { message, roomId: activeRoom.id });

    messageDOM.value = "";
  });

  socket.on("message_from_room", (data) => {
    const msgs = roomBody.querySelectorAll("div.d-flex");
    const lastMsg = msgs[msgs.length - 1];

    // create new msgDOM
    let newMsg = document.createElement("div");
    newMsg.setAttribute("user-id", data.message.userId);

    if (!!lastMsg) {
      const isSame = lastMsg.getAttribute("user-id") === data.message.userId;
      const isLeft =
        lastMsg.className.split(" ")[1] === "justify-content-start";
      if (isSame) {
        if (isLeft) {
          newMsg = msgDOM(newMsg, data, true);
        } else {
          newMsg = msgDOM(newMsg, data, false);
        }
      } else {
        if (isLeft) {
          newMsg = msgDOM(newMsg, data, false);
        } else {
          newMsg = msgDOM(newMsg, data, true);
        }
      }
    } else {
      newMsg = msgDOM(newMsg, data, true);
    }

    // append to msgBody
    roomBody.appendChild(newMsg);
    roomBody.scrollTo(0, roomBody.scrollHeight);
  });
};
