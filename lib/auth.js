import { 
  auth, 
  googleProvider 
} from './firebase';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  updateProfile,
  signInAnonymously
} from 'firebase/auth';

export const AuthService = {
  // Listen to auth changes
  onAuthChange(callback) {
    if (!auth) {
      // If server-side or mock guest mode
      const savedUser = typeof window !== 'undefined' ? localStorage.getItem('SOANGIAOAN_GUEST_USER') : null;
      if (savedUser) {
        callback(JSON.parse(savedUser));
      } else {
        callback(null);
      }
      return () => {};
    }

    return onAuthStateChanged(auth, (user) => {
      if (user) {
        // User logged in via Firebase
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'Giảng viên',
          photoURL: user.photoURL || null,
          isAnonymous: user.isAnonymous
        };
        if (typeof window !== 'undefined') {
          localStorage.removeItem('SOANGIAOAN_GUEST_USER');
        }
        callback(userData);
      } else {
        // Check for local guest user
        const savedGuest = typeof window !== 'undefined' ? localStorage.getItem('SOANGIAOAN_GUEST_USER') : null;
        if (savedGuest) {
          try {
            callback(JSON.parse(savedGuest));
          } catch (e) {
            callback(null);
          }
        } else {
          callback(null);
        }
      }
    });
  },

  // Google Sign-In
  async signInWithGoogle() {
    if (!auth) throw new Error("Firebase Auth chưa khởi tạo.");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
  },

  // Email & Password Sign In
  async signInWithEmail(email, password) {
    if (!auth) throw new Error("Firebase Auth chưa khởi tạo.");
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error("Email sign in error:", error);
      throw error;
    }
  },

  // Email & Password Sign Up
  async signUpWithEmail(email, password, displayName) {
    if (!auth) throw new Error("Firebase Auth chưa khởi tạo.");
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName && result.user) {
        await updateProfile(result.user, { displayName });
      }
      return result.user;
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  },

  // Guest / Demo Login
  signInAsGuest() {
    const guestUser = {
      uid: 'guest_' + Math.random().toString(36).substring(2, 9),
      email: 'khach@bknsg.edu.vn',
      displayName: 'Giảng viên (Khách)',
      photoURL: null,
      isAnonymous: true,
      isGuest: true
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('SOANGIAOAN_GUEST_USER', JSON.stringify(guestUser));
    }
    return guestUser;
  },

  // Sign Out
  async signOut() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('SOANGIAOAN_GUEST_USER');
    }
    if (auth && auth.currentUser) {
      await fbSignOut(auth);
    }
  }
};