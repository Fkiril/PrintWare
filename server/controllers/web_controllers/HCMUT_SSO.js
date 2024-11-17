import { adminAuth, firestore } from '../../services/FirebaseAdminSDK.js';

import { Student, SPSO } from '../../models/User.js';

export async function test(req, res) {
    console.log('test');
    const query = req.query;

    if (!query || !query.email) {
        res.status(400).send('Missing required parameters.');
        return;
    }
    else {
        console.log('Query: ', query);
        // adminAuth.getUserByEmail(query.email).then((userRecord) => {
        //     res.status(200).send(userRecord.toJSON());
        // })
        // .catch((error) => {
        //     res.status(500).send(error);
        // });

        // adminAuth.createUser({
        //     email: query.email,
        //     password: query.password,
        //     displayName: query.name
        // }).then((userRecord) => {
        //     console.log('Successfully created new user:', userRecord.uid);
        //     res.status(200).send(userRecord.uid);
        // }).catch((error) => {
        //     console.log('Error creating new user:', error);
        //     res.status(500).send(error);
        // })
    }
}

// export async function login(req, res) {
//     console.log('Received a login request!\n');
    
//     const query = req.query;
//     if (!query || !query.email || !query.password) {
//         res.status(400).send('Missing required parameters.');
//         return;
//     }
// }

// export function logout(req, res) {
//     console.log('logout');
//     res.send('This is the logout page.');
// }

export function register(req, res) {
    console.log('Received a register request!');
    const query = req.query;

    if (!query || !query.email || !query.password || !query.name) {
        res.status(400).send('Missing required parameters.');
        return;
    }

    console.log('Query: ', query);
    
    adminAuth.createUser({
        email: query.email,
        password: query.password,
        displayName: query.name
    }).then((userRecord) => {
        const user = new SPSO(userRecord.uid, query.email, query.name);
        firestore.collection('users').doc(userRecord.uid).set(user.convertToJSON());

        res.status(200).send(user.toJSON());
    }).catch((error) => {
        console.log('Error creating new user:', error);
        res.status(500).send(error);
    });
}

export function changePassword(req, res) {
    console.log('changePassword');
    res.send('This is the change password page.');
}

export function forgotPassword(req, res) {
    console.log('forgotPassword');
    res.send('This is the forgot password page.');
}

export async function deleteAccount(req, res) {
    console.log('deleteAccount');
    
    const query = req.query;
    if (!query || !query.userId) {
        res.status(400).send('Missing required parameters.');
        return;
    }

    console.log('Query: ', query);

    adminAuth.deleteUser(query.userId).then(() => {
        const userCollection = firestore.collection('users').doc(query.userId);

        if (userCollection.exists) {
            if (userCollection.data().userRole === 'student') {
                firestore.collection('wallets').doc(query.userId).delete();
            }
            userCollection.delete();
        }

        res.status(200).send('Successfully deleted user.');
    })
    .catch((error) => {
        res.status(500).send(error);
    });
}

export async function updateProfile(req, res) {
    console.log('updateProfile');
    
    const query = req.query;
    if (!query || !query.updateInfo || !query.userId) {
        res.status(400).send('Missing required parameters.');
        return;
    }

    console.log('Query: ', query);
    const userRef = firestore.collection('users').doc(query.userId);
    if (userRef.exists) {
        await firestore.runTransaction(async (transaction) => {
            const userSnapshot = await transaction.get(userRef);

            if (!userSnapshot.exists) {
                throw new Error('User not found.');
            }

            const user = new SPSO(userSnapshot.id, userSnapshot.data().userName, userSnapshot.data().userRole);
            user.setInfoFromJSON(query.updateInfo);

            transaction.set(userRef, user.convertToJSON());
        }).catch((error) => {
            console.log('Error updating user:', error);
            res.status(500).send(error);
        })
    }
    else {
        res.status(404).send('User not found.');
        return;
    }
}

export function getProfile(req, res) {
    console.log('getProfile');
    
    const query = req.query;
    if (!query || !query.userId) {
        res.status(400).send('Missing required parameters.');
        return;
    }

    console.log('Query: ', query);

    const userRef = firestore.collection('users').doc(query.userId);
    if (userRef.exists) {
        userRef.get().then((userSnapshot) => {
            res.status(200).send(userSnapshot.data());
        })
        .catch((error) => {
            res.status(500).send(error);
        })
    }
    else {
        res.status(404).send('User not found.');
        return;
    }
}

export function getUserById(req, res) {
    console.log('getUserById');
    const query = req.query;

    if (!query || !query.userId) {
        res.status(400).send('Missing required parameters.');
        return;
    }

    console.log('Query: ', query);

    adminAuth.getUserById(query.userId).then((userRecord) => {
        res.status(200).send(userRecord.toJSON());
    })
    .catch((error) => {
        res.status(500).send(error);
    });
}

export function getUserByEmail(req, res) {
    console.log('getUserByEmail');
    const query = req.query;

    if (!query || !query.email) {
        res.status(400).send('Missing required parameters.');
        return;
    }

    console.log('Query: ', query);

    adminAuth.getUserByEmail(query.email).then((userRecord) => {
        res.status(200).send(userRecord.toJSON());
    })
    .catch((error) => {
        res.status(500).send(error);
    });
}