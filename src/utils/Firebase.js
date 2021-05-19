import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import 'firebase/firestore'

if (!firebase.apps.length)
  firebase.initializeApp({
    apiKey: 'AIzaSyDCTQ_m96KhmhXuF3NlgBljUTPETvlBRyY',
    authDomain: 'beerpropertiesinc.firebaseapp.com',
    projectId: 'beerpropertiesinc',
    storageBucket: 'beerpropertiesinc.appspot.com',
    messagingSenderId: '839498375673',
    appId: '1:839498375673:web:cfeb59d9becde07bd9dd28'
  })

export const auth = firebase.auth()
export const db = firebase.database()
export const store = firebase.storage()
export const firestore = firebase.firestore()

export const homesRef = firebase.database().ref('homes')

const provider = new firebase.auth.GoogleAuthProvider()
export const signInWithGoogle = () => auth.signInWithPopup(provider)