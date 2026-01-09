import { initializeApp } from "firebase/app";
import { getVertexAI, getGenerativeModel } from "@firebase/vertexai";

// Configuration from your Firebase Console (Web App)
const firebaseConfig = {
    apiKey: "AIzaSyCCBT03Yee2GBbIr1uXgN2Xv_3mKnM2jo",
    authDomain: "planning-with-ai-e6be2.firebaseapp.com",
    projectId: "planning-with-ai-e6be2",
    storageBucket: "planning-with-ai-e6be2.firebasestorage.app",
    messagingSenderId: "861514959394",
    appId: "1:861514959394:web:705494b5117a141261987b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Vertex AI
const vertexAI = getVertexAI(app);

// Initialize Model
// Using gemini-2.0-flash-exp as 1.5 versions are discontinued
const model = getGenerativeModel(vertexAI, { model: "gemini-2.0-flash-exp" });

export { model };
