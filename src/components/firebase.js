import firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyBCYZ2lqMvf9rC2DN_Z0kYBM_UPyGz8nf0',
    authDomain: 'project-snc-39dab.firebaseapp.com',
    databaseURL: 'https://project-snc-39dab.firebaseio.com',
    projectId: 'project-snc-39dab',
    storageBucket: 'gs://project-snc-39dab.appspot.com/',
    messagingSenderId: '831777345049',
    appId: '1:831777345049:web:2908aecd38361e4a'
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export const f = firebase;
  export const auth = firebase.auth();
  export const store = firebase.firestore();
  export const storage = firebase.storage();
