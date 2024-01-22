import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {

apiKey: "AIzaSyDVI2yHFy2ERdqbYh5gplruXOhJsMuSUlc",
authDomain: "ijgmms.firebaseapp.com",
projectId: "ijgmms",
storageBucket: "ijgmms.appspot.com",
messagingSenderId: "69645852108",
appId: "1:69645852108:web:c2e4b9cf346860d5fa5169",
};

const app = initializeApp(firebaseConfig);
const appAuthWorker = initializeApp(firebaseConfig);
export const authWorker = getAuth(appAuthWorker);

// export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const storage = getStorage(app);


// live
// apiKey: "AIzaSyDVI2yHFy2ERdqbYh5gplruXOhJsMuSUlc",
// authDomain: "ijgmms.firebaseapp.com",
// projectId: "ijgmms",
// storageBucket: "ijgmms.appspot.com",
// messagingSenderId: "69645852108",
// appId: "1:69645852108:web:c2e4b9cf346860d5fa5169",


//development
// apiKey: "AIzaSyBhswArAYIvyyvjHYfuFXjoMXo2hRrsFVI",
// authDomain: "ijgmms-development.firebaseapp.com",
// projectId: "ijgmms-development",
// storageBucket: "ijgmms-development.appspot.com",
// messagingSenderId: "420514885034",
// appId: "1:420514885034:web:cb0d528c3830a9e18f4fd3",
// measurementId: "G-5CS7YXDZ9L"