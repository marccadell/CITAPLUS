import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyBtmB0v4Xl1G_cWlOvHKb2wMQyJZ1bc6y0",
    authDomain: "citaplus-c3e7a.firebaseapp.com",
    projectId: "citaplus-c3e7a",
    storageBucket: "citaplus-c3e7a.appspot.com",
    messagingSenderId: "15558295906",
    appId: "1:15558295906:web:4c7706b86f61f13a5eac3b"
  };

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore y Auth
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
