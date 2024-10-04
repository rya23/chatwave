import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { getFirestore } from "firebase/firestore" // Import Firestore

const firebaseConfig = {
    apiKey: "AIzaSyBCUgNX1EqcBb8KRtKn0odjEDTzwAI0VJ8",
    authDomain: "chatwave-e2b52.firebaseapp.com",
    projectId: "chatwave-e2b52",
    storageBucket: "chatwave-e2b52.appspot.com",
    messagingSenderId: "3448599277",
    appId: "1:3448599277:web:01734614bf3f05d73312e4",
    measurementId: "G-5Y7YMSF8PE",
}

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const db = getFirestore(app) // Initialize Firestore

// Initialize Firebase Authentication and set up Google provider
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

// Function to sign in with Google
const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider)
        .then((result) => {
            // This gives you a Google Access Token
            const credential = GoogleAuthProvider.credentialFromResult(result)
            const token = credential.accessToken

            // The signed-in user info
            const user = result.user
            console.log("User info:", user)
            return user
        })
        .catch((error) => {
            console.error("Error during Google Sign-In:", error)
            throw error
        })
}

export { app, analytics, auth, db, signInWithGoogle }
