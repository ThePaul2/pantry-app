import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCZt6di-48mkBKyloVNxU_uU4iMARlJTAM",
    authDomain: "pantry-app-daf36.firebaseapp.com",
    projectId: "pantry-app-daf36",
    storageBucket: "pantry-app-daf36.appspot.com",
    messagingSenderId: "619661766744",
    appId: "1:619661766744:web:3ea1d9326a29e181b9da2d",
    measurementId: "G-T6MMKJKCZW"
  };
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };