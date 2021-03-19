import firebase from "firebase/app";
import "firebase/auth";
// import "firebase/database";
// import "firebase/storage";

if (!firebase.apps.length)
  firebase.initializeApp({
    apiKey: "AIzaSyDCTQ_m96KhmhXuF3NlgBljUTPETvlBRyY",
    authDomain: "beerpropertiesinc.firebaseapp.com",
    projectId: "beerpropertiesinc",
    storageBucket: "beerpropertiesinc.appspot.com",
    messagingSenderId: "839498375673",
    appId: "1:839498375673:web:cfeb59d9becde07bd9dd28"
  });

const auth = firebase.auth;
// const db = firebase.database();
// const store = firebase.storage();

module.exports = { auth };
