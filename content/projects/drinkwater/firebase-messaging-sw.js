/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/8.7.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.7.1/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyDeub1V35nG6gcS-hwjRBQxqFUs37upWTA",
  authDomain: "drinkwater-8bc6a.firebaseapp.com",
  projectId: "drinkwater-8bc6a",
  storageBucket: "drinkwater-8bc6a.appspot.com",
  messagingSenderId: "910438080317",
  appId: "1:910438080317:web:882ac30523048f3592ef54",
  measurementId: "G-SP6GNKBQFE",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
