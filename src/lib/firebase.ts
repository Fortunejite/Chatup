// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';
import { v4 } from 'uuid';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

interface UploadProp {
  file: File;
  path: 'avater' | 'posts/image' | 'posts/video' | 'user/images';
}

const firebaseConfig = {
  apiKey: 'AIzaSyC_MT_lOmP2dtjs--dzJoHdxPEwJdwJh6w',
  authDomain: 'messenger-425214.firebaseapp.com',
  projectId: 'messenger-425214',
  storageBucket: 'messenger-425214.appspot.com',
  messagingSenderId: '423544866868',
  appId: '1:423544866868:web:b2fa1cb385460169716261',
  measurementId: 'G-7TZVLFN02R',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const uploadFile = async ({ file, path }: UploadProp) => {
  if (file == null) return '';
  const imageRef = ref(storage, `${path}/${file.name + v4()}`);
  const snapshot = await uploadBytes(imageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  return url;
};
