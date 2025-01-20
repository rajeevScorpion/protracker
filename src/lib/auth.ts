import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  confirmPasswordReset as firebaseConfirmPasswordReset,
  signOut as firebaseSignOut,
  type User
} from 'firebase/auth';
import { auth } from './firebase';
import { settingsService } from '../services/settings.service';

const googleProvider = new GoogleAuthProvider();

interface AuthResult {
  user: User | null;
  error: string | null;
}

export const signIn = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { user: null, error: 'Invalid email or password' };
  }
};

export const signUp = async (
  email: string, 
  password: string, 
  profileData: {
    name: string;
    designation: string;
    company: string;
    mobile: string;
  }
): Promise<AuthResult> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user profile
    await settingsService.initializeUserProfile(result.user.uid, {
      email,
      ...profileData
    });

    return { user: result.user, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { user: null, error: 'Failed to create account' };
  }
};

export const signInWithGoogle = async (): Promise<AuthResult> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user profile exists
    const profile = await settingsService.getUserProfile(user.uid);
    
    // If no profile exists, create one with Google data
    if (!profile) {
      await settingsService.initializeUserProfile(user.uid, {
        name: user.displayName || '',
        email: user.email || '',
        designation: '',
        company: '',
        mobile: ''
      });
    }
    
    return { user, error: null };
  } catch (error) {
    console.error('Google sign-in error:', error);
    return { user: null, error: 'Failed to sign in with Google' };
  }
};

export const sendPasswordResetEmail = async (email: string): Promise<{ error: string | null }> => {
  try {
    await firebaseSendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error) {
    console.error('Password reset email error:', error);
    return { error: 'Failed to send password reset email' };
  }
};

export const confirmPasswordReset = async (code: string, newPassword: string): Promise<{ error: string | null }> => {
  try {
    await firebaseConfirmPasswordReset(auth, code, newPassword);
    return { error: null };
  } catch (error) {
    console.error('Password reset confirmation error:', error);
    return { error: 'Failed to reset password' };
  }
};

export const signOut = () => firebaseSignOut(auth);

export const getCurrentUser = (): User | null => auth.currentUser;
