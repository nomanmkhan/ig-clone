// const firebaseApp = firebase.initializeApp({
//     apiKey: "AIzaSyAwTMqfg9DIeSkm7q3O5KSIbpLWyt-oBdE",
//     authDomain: "instagram-clone-27d79.firebaseapp.com",
//     projectId: "instagram-clone-27d79",
//     storageBucket: "instagram-clone-27d79.appspot.com",
//     messagingSenderId: "311310857293",
//     appId: "1:311310857293:web:18d4a951244ca918e69804",
//     measurementId: "G-Z66Z6P1BEF"
// });

// const db = firebaseApp.fireStore();
// const auth = firebase.auth();
// const storage = firebase.storage();

// export { db, auth, storage }

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseApp = initializeApp({
    apiKey: "AIzaSyAwTMqfg9DIeSkm7q3O5KSIbpLWyt-oBdE",
    authDomain: "instagram-clone-27d79.firebaseapp.com",
    projectId: "instagram-clone-27d79",
    storageBucket: "instagram-clone-27d79.appspot.com",
    messagingSenderId: "311310857293",
    appId: "1:311310857293:web:18d4a951244ca918e69804",
    measurementId: "G-Z66Z6P1BEF"
});
const db = getFirestore();

export { firebaseApp, db }

