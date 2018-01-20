import Rebase from 're-base';
import firebase from 'firebase';

const config = {
    // apiKey: process.env.REACT_APP_FIREBASE_KEY, 
    // authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
    // databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
    // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    // messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID

    apiKey: "AIzaSyC_NmiKuXO1u8RFx9h54W8RV-KNs0FXl1A",
    authDomain: "tunechainz-c924d.firebaseapp.com",
    databaseURL: "https://tunechainz-c924d.firebaseio.com",
    projectId: "tunechainz-c924d",
    storageBucket: "",
    messagingSenderId: "738472612506"
  };

  console.log(config.databaseURL);

  const app = firebase.initializeApp(config);
  const base = Rebase.createClass(app.database());
  const googleProvider = new firebase.auth.GoogleAuthProvider();

  export { app, base, googleProvider}