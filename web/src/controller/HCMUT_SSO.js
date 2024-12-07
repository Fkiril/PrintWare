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

            const customToken = await user.getIdToken();
            return { message: 'Login successfully', data: { user, customToken } };
        })
        .catch((error) => {
            throw error;
        });

    return result;
}

export async function logout() {
    return await signOut(clientAuth).then(() => {
            return { message: 'Logout successfully' };
        })
        .catch((error) => {
            throw error;
        });
}

export async function changePassword(email, oldPassword, newPassword) {
    const user = clientAuth.currentUser;
    
    const credential = EmailAuthProvider.credential(email, oldPassword);
    const result = await reauthenticateWithCredential(user, credential)
        .then(() => {
            return { message: 'Reauthenticated successfully' };
        })
        .catch((error) => {
            throw error;
        });
    if (result) {
        return result;
    }
    
    return await updatePassword(clientAuth.currentUser, newPassword)
        .then(() => {
            return { message: 'Password changed successfully' };
        })
        .catch((error) => {
            throw error;
        });
}

export async function sendCustomPasswordResetEmail(email) {
    return await sendPasswordResetEmail(email)
        .then(() => {
            return { message: 'Password reset email sent successfully' };
        })
        .catch((error) => {
            throw error;
        });
}

export async function resetPassword(oodcode, email) {
    return await confirmPasswordReset(clientAuth, oodcode, email)
        .then(() => {
            return { ok: true, message: 'Password reset successfully' };
        })
        .catch((error) => {
            throw error;
        });
}

export async function loginWithGoogleAccount() {
    return await signInWithPopup(clientAuth, googleProvider).then(async (result) => {
        const user = result.user;
        const customToken = await user.getIdToken();

        const credential = credentialFromResult(result);
        const googleAccessToken = credential.accessToken;

        return { message: 'Login successfully', data: { user, customToken, googleAccessToken } };
    }).catch((error) => {
        throw error;
    })
}