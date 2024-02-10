// Import the functions you need from the SDKs you need


// Initialize Firebase

// Import the functions you need from the SDKs you need
// const firebase = require('firebase/app');
// require('firebase/analytics');
// var admin = require("firebase-admin");

// var serviceAccount = require("./login99-64b21-firebase-adminsdk-s74hz-d2359bdcfd.json");
// // Your web app's Firebase configuration
// const firebaseConfig = {
//   credential: admin.credential.cert(serviceAccount),
  
//   apiKey: "AIzaSyAq3WXdfZ4xjVGiVmTFakzQYzwaQCLnzNU",
//   authDomain: "login99-64b21.firebaseapp.com",
//   databaseURL: "https://login99-64b21-default-rtdb.firebaseio.com",
//   projectId: "login99-64b21",
//   storageBucket: "login99-64b21.appspot.com",
//   messagingSenderId: "308931203871",
//   appId: "1:308931203871:web:99e82473f27f625b96962a",
//   measurementId: "G-8ETHQ792FF"
// };

// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// module.exports = admin; 
// // Initialize Firebase Analytics
// //const analytics = firebase.analytics();

// // Now you can use 'analytics' for Firebase Analytics tracking
// firebase.js

const admin = require("firebase-admin");
const serviceAccount = require("./login99-64b21-firebase-adminsdk-s74hz-d2359bdcfd.json");

const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
  // Add other Firebase configurations as needed
  storageBucket: "gs://login99-64b21.appspot.com",
  
};

admin.initializeApp(firebaseConfig); // Initialize the Firebase app

module.exports = admin; // Export the admin object
