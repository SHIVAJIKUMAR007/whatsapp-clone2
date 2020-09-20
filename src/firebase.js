import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDc4GmNHGmtTAqTfzNR_pU2fUolqhba9N8",
  authDomain: "whatsapp-dfb3c.firebaseapp.com",
  databaseURL: "https://whatsapp-dfb3c.firebaseio.com",
  projectId: "whatsapp-dfb3c",
  storageBucket: "whatsapp-dfb3c.appspot.com",
  messagingSenderId: "801288025216",
  appId: "1:801288025216:web:fa5bd2a212ec7c6850a265",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, db, provider };
