import { 
  FacebookAuthProvider,
  GoogleAuthProvider, 
  signInWithPopup,
  signOut 
} from "firebase/auth";
import { auth } from "./firebase";

export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const signInWithProvider = (provider) => {
  return signInWithPopup(auth, provider);
};

export const logout = () => signOut(auth);
