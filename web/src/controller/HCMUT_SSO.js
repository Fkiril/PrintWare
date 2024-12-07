import { clientAuth, googleProvider, credentialFromResult } from '../services/FirebaseClientSDK.js';
import { signInWithEmailAndPassword, signOut, reauthenticateWithCredential, confirmPasswordReset, EmailAuthProvider, updatePassword, sendPasswordResetEmail, signInWithRedirect, signInWithPopup, getRedirectResult } from 'firebase/auth';

/**
 * Login with email and password using Firebase Client Auth, it will return the user and the custom token that used for authentication with the server
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{user: import('firebase/auth').User, customToken: string}>}
 */
export async function loginWithEmailAndPassword(email, password) {
    const result = await signInWithEmailAndPassword(clientAuth,email, password)
        .then( async (userCredential) => {
            const user = userCredential.user;
            console.log('User logged in:', user);

            const customToken = await user.getIdToken();
            console.log('Custom token:', customToken);
            return { user, customToken };
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            if (errorCode === 'auth/user-not-found') {
                console.log('User not found');
            } else if (errorCode === 'auth/wrong-password') {
                console.log('Wrong password');
            } else if (errorCode === 'auth/too-many-requests') {
                console.log('Too many requests');
            }

            throw error;
        });

    return result;
}

export async function logout() {
    return await signOut(clientAuth).then(() => {
            return { ok: true, message: 'Logout successfully' };
        })
        .catch((error) => {
            return { ok: false, message: error.message };
        });
}

export async function changePassword(email, oldPassword, newPassword) {
    const user = clientAuth.currentUser;
    
    const credential = EmailAuthProvider.credential(email, oldPassword);
    const result = await reauthenticateWithCredential(user, credential)
        .then(() => {
            return { ok: true, message: 'Reauthenticated successfully' };
        })
        .catch((error) => {
            return { ok: false, message: error.message };
        });
    if (!result.ok) {
        return result;
    }
    
    return await updatePassword(clientAuth.currentUser, newPassword)
        .then(() => {
            return { ok: true, message: 'Password changed successfully' };
        })
        .catch((error) => {
            return { ok: false, message: error.message };
        });
}

export async function sendCustomPasswordResetEmail(email) {
    return await sendPasswordResetEmail(email)
        .then(() => {
            return { ok: true, message: 'Password reset email sent successfully' };
        })
        .catch((error) => {
            return { ok: false, message: error.message };
        });
}

export async function resetPassword(oodcode, email) {
    return await confirmPasswordReset(clientAuth, oodcode, email)
        .then(() => {
            return { ok: true, message: 'Password reset successfully' };
        })
        .catch((error) => {
            return { ok: false, message: error.message };
        });
}

export async function loginWithGoogleAccount() {
    return await signInWithPopup(clientAuth, googleProvider).then(async (result) => {
        const user = result.user;
        const customToken = await user.getIdToken();

        const credential = credentialFromResult(result);
        const googleAccessToken = credential.accessToken;

        return { user, customToken, googleAccessToken };
    }).catch((error) => {
        console.log("loginWithGoogleAccount error: ", error);
        throw error;
    })
}