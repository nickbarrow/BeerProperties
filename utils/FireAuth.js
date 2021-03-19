import { auth } from "./Firebase"

var createUser = (email, password) => {
    return auth().createUserWithEmailAndPassword(email, password);
}

var signIn = (email, password) => {
    return auth().signInWithEmailAndPassword(email, password);
}

var signInWithGoogle = () => {
    const provider = new auth.GoogleAuthProvider();
    return auth().signInWithPopup(provider);
}

var logout = () => {
    return auth().signOut();
}

module.exports = { auth, createUser, signIn, signInWithGoogle, logout }