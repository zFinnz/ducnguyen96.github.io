const loginOrRegister = () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const repeatPasswordElem = document.getElementById('repeat-password');
  const repeatPassword = repeatPasswordElem.value;

  const isLogin = repeatPasswordElem.className.split(' ').includes('d-none');
  if (isLogin) {
    login(username, password);
  } else {
    register(username, password, repeatPassword);
  }
};

const login = (username, password) => {
  const query = `mutation login($input: UserLoginInput!){
    login(input: $input){
        expiresIn
        accessToken
      }
    }`;
  queryGraphQL(
    query,
    {
      input: {
        username,
        password,
      },
    },
    '',
  )
    .then((r) => r.json())
    .then((data) => {
      if (data.errors) {
        const message = data.errors[0].message;

        const errorDOM = document.getElementById('login-message');
        errorDOM.innerHTML = message;
      } else {
        createCookie('accessToken', data.data.login.accessToken, 15);
        location.reload();
      }
    })
    .catch((error) => {
      alert(error);
    });
};

const register = (username, password, repeatPassword) => {
  const query = `mutation userRegister($input:  UserRegisterInput!){
    userRegister(input: $input){
      user {
        id
        username
        createdAt
        updatedAt
      }
      token {
        expiresIn
        accessToken
      }
      }
    }`;
  queryGraphQL(
    query,
    {
      input: {
        username,
        password,
        repeatPassword,
      },
    },
    '',
  )
    .then((r) => r.json())
    .then((data) => {
      if (data.errors) {
        const message = data.errors[0].message;

        const errorDOM = document.getElementById('login-message');
        errorDOM.innerHTML = message;
      } else {
        createCookie(
          'accessToken',
          data.data.userRegister.token.accessToken,
          15,
        );
        location.reload();
      }
    })
    .catch((error) => {
      alert(error);
    });
};

const me = () => {
  const loginModal = document.getElementById('login-modal');

  const query = `query me {
    me {
      id
      username
      createdAt
      updatedAt
    }
  }`;

  const cookie = document.cookie;
  if (!cookie) {
    loginModal.className = 'wrapper fadeInDown fixed-top';
    return;
  }

  const splittedCookie = document.cookie.split('=');
  if (splittedCookie[0] !== 'accessToken') {
    loginModal.className = 'wrapper fadeInDown fixed-top';
    return;
  }

  const accessToken = splittedCookie[1];

  queryGraphQL(query, {}, accessToken)
    .then((r) => r.json())
    .then((data) => {
      if (data.errors) {
        console.log(data.errors);
      } else {
        loginModal.className = 'wrapper fadeInDown fixed-top d-none';
        switchTechButton.click();
      }
    })
    .catch((error) => {
      alert(error);
    });
};

const rooms = (namespace) => {
  const query = `query rooms($namespace: String!) {
    rooms(namespace: $namespace) {
      id
      name
      namespace
      image
      createdAt
      updatedAt
    }
  }`;
  queryGraphQL(
    query,
    {
      namespace,
    },
    '',
  )
    .then((r) => r.json())
    .then((data) => {
      if (data.errors) {
        console.log(data.errors);
      } else {
        appendRoomToList(data);
      }
    })
    .catch((error) => {
      alert(error);
    });
};

const messages = (event) => {
  const path = event.path || (event.composedPath && event.composedPath());
  const room = path.find((i) => i.id !== '');
  room.className = 'active';

  // Check if current active room
  const roomName = room.querySelector('.user_info span').innerHTML;
  if (document.querySelector('.card-header .user_info span')) {
    if (
      roomName ===
      document.querySelector('.card-header .user_info span').innerHTML
    )
      return;
  }

  const otherRooms = document.querySelectorAll('ui.contacts > li');
  otherRooms.forEach((dom) => {
    if (dom.id !== room.id) {
      dom.style.backgroundColor = null;
      dom.className = '';
    }
  });
  socket.emit('join', room.id, (data) => {
    const query = `query messages($input: QueryMessagesInput!) {
      messages(input: $input) {
        meta {
          itemCount
          totalItems
        }
        items {
          id
          userId
          content
          createdAt
          user {
            id
            username
          }
        }
      }
    }`;
    queryGraphQL(
      query,
      {
        input: {
          roomId: room.id,
        },
      },
      '',
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.errors) {
          console.log(data.errors);
        } else {
          updateRoomContent(data, room);
        }
      })
      .catch((error) => {
        alert(error);
      });
  });
};
