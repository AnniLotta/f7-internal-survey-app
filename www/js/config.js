let db = null;

// Firebase configuration and initialization
const initFirebase = () => {

  var firebaseConfig = {
    apiKey: "AIzaSyCAeTlzv2PZlxIH9v0J_93TUG_gHXfS7fg",
    authDomain: "survey-app-bf0ad.firebaseapp.com",
    projectId: "survey-app-bf0ad",
    storageBucket: "survey-app-bf0ad.appspot.com",
    messagingSenderId: "91193901112",
    appId: "1:91193901112:web:4d7a3b7736ef62839166cd",
    measurementId: "G-JLPGG7D5SF"
  };

  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
};