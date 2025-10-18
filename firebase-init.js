// Импорт необходимых модулей
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// Конфигурация Firebase
const firebaseConfig = {
    apiKey: "AIzaSyALRAoKyqYYp8CNTHjNp9cIYHcGfPDtV6o",
    authDomain: "digital-library-e6098.firebaseapp.com",
    projectId: "digital-library-e6098",
    storageBucket: "digital-library-e6098.firebasestorage.app",
    messagingSenderId: "949623312505",
    appId: "1:949623312505:web:5cdf5dd067d26fe88b44a8",
    measurementId: "G-E3V8W8WQLB"
};

// Инициализация
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);