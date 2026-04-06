import { auth, db } from './firebase';
import {
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  type UserCredential
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

export class AuthService {
  async signInWithEmail(email: string, password: string): Promise<{ userCredential: UserCredential, hasUserInfo: boolean }> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userInfoRef = doc(db, 'userInfo', userCredential.user.uid);
    const userInfoDoc = await getDoc(userInfoRef);

    return {
      userCredential,
      hasUserInfo: userInfoDoc.exists()
    };
  }

  async signUp(userData: { fullName: string, email: string, phone: string, password: string }): Promise<void> {
    const { email, password, fullName, phone } = userData;
    const usersRef = collection(db, 'user');
    const q = query(usersRef, where('email', '==', email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw { code: 'auth/email-already-in-use' };
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user);

    await setDoc(doc(db, 'user', user.uid), {
      email,
      fullName,
      phone,
      createdAt: serverTimestamp()
    });

    await signOut(auth);
  }

  async signInWithGoogleCredential(idToken: string): Promise<UserCredential> {
    const credential = GoogleAuthProvider.credential(idToken);
    return await signInWithCredential(auth, credential);
  }

  getAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found': return 'No account found with this email.';
      case 'auth/invalid-credential': return 'Email or password is wrong.';
      case 'auth/too-many-requests': return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed': return 'No internet connection.';
      case 'auth/email-already-in-use': return 'Email already registered.';
      case 'auth/weak-password': return 'Password is too weak.';
      case 'auth/invalid-email': return 'Invalid email format.';
      default: return 'Action failed. Please try again.';
    }
  }
}

export const authService = new AuthService();
