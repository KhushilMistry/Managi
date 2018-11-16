import * as firebase from "firebase"

var config = {
  apiKey: "AIzaSyCcNpyiARuOzGMi0zDOmlxz9prrF8VX-J8",
  authDomain: "spmproject-96271.firebaseapp.com",
  databaseURL: "https://spmproject-96271.firebaseio.com",
  projectId: "spmproject-96271",
  storageBucket: "spmproject-96271.appspot.com",
  messagingSenderId: "433083141867"
};
firebase.initializeApp(config);

export const databaseRef = firebase;
