import * as firebase from "firebase"

var config = {
  apiKey: "AIzaSyCGsuWD_lsEZjZ-I6nZRBphEe3Nm6IfGtI",
  authDomain: "concours18-f3b7a.firebaseapp.com",
  databaseURL: "https://concours18-f3b7a.firebaseio.com",
  projectId: "concours18-f3b7a",
  storageBucket: "concours18-f3b7a.appspot.com",
  messagingSenderId: "261845660297"
};
firebase.initializeApp(config);

export const databaseRef = firebase.database().ref().child("events");
