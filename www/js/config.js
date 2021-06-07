let db = null;

// Firebase configuration and initialization
const initFirebase = () => {

  //Put here your own Firebase configuration
  var firebaseConfig = {
    apiKey: "YOUR_OWN_APIKEY_HERE",
    authDomain: "YOUR_OWN_AUTHDOMAIN_HERE",
    projectId: "YOUR_OWN_PROJECTID_HERE",
    storageBucket: "YOUR_OWN_STORAGE_BUCKET_HERE",
    messagingSenderId: "YOUR_OWN_MESSAGING_SENDER_ID_HERE",
    appId: "YOUR_OWN_APPID_HERE",
    measurementId: "YOUR_OWN_MEASUREMENTID_HERE"
  };

  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
};