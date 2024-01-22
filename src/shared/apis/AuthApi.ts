import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  User as FirebaseUser,
} from "firebase/auth";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";
import { auth, db } from "../config/firebase-config";
import { IUser } from "../models/User";
import axios from 'axios';

export default class AuthApi {
  constructor(private api: AppApi, private store: AppStore) {
    this.handleAuthStateChange();
  }

  private handleAuthStateChange() {
    onAuthStateChanged(auth, async (user) => {
      this.store.auth.setLoading(true); // start loading.
      if (!user) {
        this.onSignedOut();
        this.store.auth.setLoading(false); // start loading.
        return;
      }

      try {
        this.onSignedIn(user);
      } catch (error) {
        this.store.auth.setLoading(false);
        this.onSignedOut();
      }
    });
  }

  private async getAuth() {
    try {
      const response = await axios.get('https://www.docfoxapp.com/api/v2/authentications/new', {
        headers: {
          'Accept': 'application/vnd.api+json',
          'X-Client-Api-Key': 'VFgh6t1t54HWz5uD-xkpahv3O3-O35_qCRxmnJr5AuXQh1vE-uSHd_kkiZXP7gz_bKE',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  private async onSignedIn(user: FirebaseUser) {
    this.store.auth.setLoading(true)
    const $doc = await getDoc(doc(db, "users", user.uid));

    if (!$doc.exists()) {
      this.store.auth.setLoading(false)
      return;
    }
    const $user = { uid: $doc.id, ...$doc.data() } as IUser;
    this.store.auth.logIn($user);
    this.store.auth.setLoading(false)
  }

  async signIn(email: string, password: string) {
    setPersistence(auth, browserLocalPersistence).then(() => {
      return signInWithEmailAndPassword(auth, email, password);
    }).catch((error) => {
      return null
    });

    const userCredential = await signInWithEmailAndPassword(
      auth, email, password).catch((error) => {
        return null;
      });

    if (userCredential) return userCredential.user;
    return userCredential;
  }

  async passwordResetWithEmail(email: string) {
    await sendPasswordResetEmail(auth, email).then(function () {
      alert("Password reset email sent.");
    }).catch(function (error) {
      alert("Could not send email.");
    });
  }

  async passwordResetWithOldPassword(email: string, oldPassword: string, newPassword: string) {
    const credential = EmailAuthProvider.credential(email, oldPassword);
    const user = auth.currentUser;
    if (!user) return;
    await reauthenticateWithCredential(user, credential).then(() => {
      if (newPassword.length >= 6)
        // User re-authenticated.
        updatePassword(user, newPassword).then(function () {
          // Update successful.
          alert("Password reset successfully");
        }).catch(function (error) {
          // An error happened.
          alert("Could not reset password");
        });
      else alert("Password should be atleast 6 characters long");
    }).catch((error) => {
      // An error happened.
      alert("Incorrect password");
    });
  }

  // logout
  async onSignedOut() {
    try {
      await signOut(auth);
    } catch (error) {
      window.alert("sign-out failed..")
    }
    this.store.auth.logOut();
  }
}
