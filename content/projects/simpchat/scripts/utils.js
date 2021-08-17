const createCookie = (name, value, days) => {
  let expires = '';
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toGMTString();
  }
  document.cookie = name + '=' + value + expires + '; path=/';
};

const queryGraphQL = (query, variables, accessToken) => {
  return fetch('http://localhost:3001/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query, variables }),
  });
};

const msgDOM = (dom, data, isLeft) => {
  if (isLeft) {
    dom.className = 'd-flex justify-content-start mb-4';
    dom.innerHTML = `<div class="img_cont_msg">
        <img
          src="https://robohash.org/honey?set=set1"
          class="rounded-circle user_img_msg"
        />
        <span class="username">${data.user.username}</span>
      </div>
      <div class="msg_cotainer">
        ${data.message.content}
        <span class="msg_time">${new Date(
          data.message.createdAt,
        ).toLocaleTimeString()}</span>
      </div>`;
  } else {
    dom.className = 'd-flex justify-content-end mb-4';
    dom.innerHTML = `<div class="msg_cotainer_send">
          ${data.message.content}
          <span class="msg_time_send">${new Date(
            data.message.createdAt,
          ).toLocaleTimeString()}</span>
        </div>
        <div class="img_cont_msg">
          <img
            src="https://robohash.org/honey?set=set1"
            class="rounded-circle user_img_msg"
          />
          <span class="username">${data.user.username}</span>
        </div>`;
  }
  return dom;
};

const msgInnerHtml = (message, isLeft) => {
  if (isLeft) {
    return `<div class="d-flex justify-content-start mb-4" user-id=${
      message.userId
    }>
  <div class="img_cont_msg">
    <img
      src="https://robohash.org/honey?set=set1"
      class="rounded-circle user_img_msg"
    />
    <span class="username">${message.user.username}</span>
  </div>
  <div class="msg_cotainer">
    ${message.content}
    <span class="msg_time">${new Date(
      message.createdAt,
    ).toLocaleTimeString()}</span>
  </div>
</div>`;
  } else {
    return `<div class="d-flex justify-content-end mb-4" user-id=${
      message.userId
    }>
    <div class="msg_cotainer_send">
      ${message.content}
      <span class="msg_time_send">${new Date(
        message.createdAt,
      ).toLocaleTimeString()}</span>
    </div>
    <div class="img_cont_msg">
      <img
        src="https://robohash.org/honey?set=set1"
        class="rounded-circle user_img_msg"
      />
      <span class="username">${message.user.username}</span>
    </div>
  </div>`;
  }
};
