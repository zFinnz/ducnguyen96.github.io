// Switch namespace
const switchTechButton = document.getElementById("namespace-tech-btn");
const switchMusicButton = document.getElementById("namespace-music-btn");

switchTechButton.addEventListener("click", () => {
  switchTechButton.className = "mt-3 btn btn-primary bg-green";
  switchMusicButton.className = "mt-3 btn";

  connectToNameSpace("tech");
});

switchMusicButton.addEventListener("click", () => {
  switchMusicButton.className = "mt-3 btn btn-primary bg-green";
  switchTechButton.className = "mt-3 btn";

  connectToNameSpace("music");
});

// Login modal
const registerBtn = document.getElementById("formFooter");
const loginBtn = document.getElementById("login-btn");
const repeatPwInp = document.getElementById("repeat-password");
registerBtn.addEventListener("click", () => {
  repeatPwInp.className = "login-input";
  loginBtn.value = "Register";
});

const submitFormLogin = (event) => {
  event.preventDefault();
  loginOrRegister();
};

const appendRoomToList = (data) => {
  const ui = document.querySelector("ui.contacts");
  ui.innerHTML = "";
  const rooms = data.data.rooms;
  rooms.forEach((room, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
    <div class="d-flex bd-highlight">
      <div class="img_cont">
        <img
          src="${room.image}"
          class="rounded-circle user_img"
        />
      </div>
      <div class="user_info">
        <span>${room.name}</span>
        <p>online: 1000</p>
      </div>
    </div>
  `;
    li.addEventListener("click", (event) => {
      messages(event);
    });
    li.id = room.id;
    ui.appendChild(li);
    if (index === 0) {
      li.click();
    }
  });
};

const updateRoomContent = (data, room) => {
  room.style.backgroundColor = "#526e8a";
  const roomCard = document.querySelector(".col-md-8.col-xl-6.chat > div.card");

  // room-head
  const roomHead = roomCard.querySelector(".card-header.msg_head");

  // room-body
  const roomBody = roomCard.querySelector(".card-body.msg_card_body");
  let roomBodyInnerHtml = "";

  // room-footer
  // const roomFooter = roomCard.querySelector('.card-footer');

  const messages = data.data.messages.items;
  let previous = {};
  messages.reverse().forEach((message, index) => {
    let isLeft;
    if (!previous.data) {
      isLeft = true;
    } else {
      if (previous.data.userId === message.userId) {
        isLeft = previous.isLeft;
      } else {
        isLeft = !previous.isLeft;
      }
    }

    previous.isLeft = isLeft;
    previous.data = message;

    roomBodyInnerHtml += msgInnerHtml(message, isLeft);
  });

  roomHead.innerHTML = room.innerHTML;
  roomBody.innerHTML = roomBodyInnerHtml;

  roomBody.scrollTo(0, roomBody.scrollHeight);
};

window.onload = () => {
  if ("WebSocket" in window) {
    me();
  }
};
