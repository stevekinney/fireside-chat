import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyDBJpvb6ZtDLUgNeoCq1KchXqmO5k4QpqY',
  authDomain: 'fireside-chat-55ce7.firebaseapp.com',
  databaseURL: 'https://fireside-chat-55ce7.firebaseio.com',
  storageBucket: 'fireside-chat-55ce7.appspot.com',
};

export default firebase.initializeApp(config);

const provider = new firebase.auth.GoogleAuthProvider();

export function signIn() {
  return firebase.auth().signInWithPopup(provider);
}
