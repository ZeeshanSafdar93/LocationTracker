import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDos_M1ETFcDfg29niKUNJX7oKB0Ehh6FE",
    authDomain: "mylocationtracker-b3a0d.firebaseapp.com",
    databaseURL: "https://mylocationtracker-b3a0d-default-rtdb.firebaseio.com",
    projectId: "mylocationtracker-b3a0d",
    storageBucket: "mylocationtracker-b3a0d.appspot.com",
    messagingSenderId: "283988275934",
    appId: "1:283988275934:web:c94450541d0fd6f926884f",
    measurementId: "G-57Y2CV5T9Y"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export const addTrack = (track: Array<{latitude: number, longitude: number}>) =>{ 
      firebase.firestore()
        .collection('MyTracks')
        .add({
          track: track,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          }).then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
  };