import { auth } from "./Firebase"

export const createUser = (email, password) => {
    return auth.createUserWithEmailAndPassword(email, password);
}

export const signIn = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
}

export const signInWithGoogle = () => {
    const provider = new auth.GoogleAuthProvider();
    return auth.signInWithPopup(provider);
}

export const logout = () => {
    return auth.signOut();
}