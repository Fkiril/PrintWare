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
    await signOut(clientAuth)
        .catch((error) => {
            console.log(error);
            throw error;
        });
}

export async function changePassword(email, oldPassword, newPassword) {
    const user = clientAuth.currentUser;
    
    const credential = EmailAuthProvider.credential(email, oldPassword);
    await reauthenticateWithCredential(user, credential)
        .catch((error) => {
            console.log("reauthenticateWithCredential error: ", error);
            throw error;
        });
    
    await updatePassword(clientAuth.currentUser, newPassword)
        .then(() => {
            console.log('Password changed successfully');
        })
        .catch((error) => {
            console.log("updatePassword error: ", error);
            throw error;
        });
}

export async function sendCustomPasswordResetEmail(email) {
    await sendPasswordResetEmail(email)
        .then(() => {
            console.log('Password reset email sent successfully');
        })
        .catch((error) => {
            console.log("sendPasswordResetEmail error: ", error);
            throw error;
        });
}

export async function resetPassword(oodcode, email) {
    await confirmPasswordReset(clientAuth, oodcode, email)
        .then(() => {
            console.log('Password reset email sent successfully');
        })
        .catch((error) => {
            console.log("confirmPasswordReset error: ", error);
            throw error;
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