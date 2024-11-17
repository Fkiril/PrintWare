import { clientAuth } from '../services/FirebaseClientSDK.js';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

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
