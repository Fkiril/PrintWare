import { Readable } from 'stream';

import { adminAuth, firestore } from '../../services/FirebaseAdminSDK.js';
import { googleDrive } from '../../services/GoogleSDK.js';

import { Student, SPSO } from '../../models/User.js';

export async function test(req, res) {
    console.log('test');

    if (!req) {
        res.status(400).send('Missing required parameters.');
        return;
    }
    else {
        res.send('Test request received.');
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

// Checked
export async function register(req, res) {
    console.log('Received a register request!');
    const body = req.body;

    if (!body || !body.email || !body.password || !body.userName) {
        res.status(400).send('Missing required parameters.');
        return;
    }

    const ftQuery = firestore.collection(process.env.USERS_COLLECTION).where('email', '==', body.email);
    const querySnapshot = await ftQuery.get();
    if (!querySnapshot.empty) {
        res.status(400).send('Email already exists.');
        return;
    }

    body['userRole'] = 'student';
    console.log('Body: ', body);
    
    await adminAuth.createUser({
        email: body.email,
        password: body.password,
        displayName: body.userName
    }).then((userRecord) => {
        const user = new Student();
        user.setInfoFromJSON(body);

        const batch = firestore.batch();
        const userRef = firestore.collection(process.env.USERS_COLLECTION).doc(userRecord.uid);

        batch.set(userRef, user.convertToJSON());
        batch.update(userRef, { userId: userRecord.uid })

        batch.commit().then(() => {
            user.userId = userRecord.uid;
            res.status(201).send(user.convertToJSON());
        }).catch((error) => {
            console.log('Error updating database for new user:', error);
            res.status(500).send(error.message);
        });

    }).catch((error) => {
        console.log('Error creating new user:', error);
        res.status(500).send(error.message);
    });
}


// Checked
export async function adminRegister(req, res) {
    console.log('adminRegister');

    if (!req || !req.body|| !req.body.email || !req.body.password) {
        res.status(400).send('Missing required parameters.');
        return;
    }

    const ftQuery = firestore.collection(process.env.ADMINS_COLLECTION).where('email', '==', body.email);
    const querySnapshot = await ftQuery.get();
    if (!querySnapshot.empty) {
        res.status(400).send('Email already exists.');
        return;
    }

    const body = req.body;
    body['userRole'] = 'admin';
    body['highestAuthority'] = false;
    console.log('Body: ', body);

    await adminAuth.createUser({
        email: body.email,
        password: body.password,
        displayName: body.userName?? ''
    }).then((userRecord) => {
        const admin = new SPSO();
        admin.setInfoFromJSON(body);

        const batch = firestore.batch();
        const adminRef = firestore.collection(process.env.ADMINS_COLLECTION).doc(userRecord.uid);

        batch.set(adminRef, admin.convertToJSON());
        batch.update(adminRef, { userId: userRecord.uid })

        batch.commit().then(() => {
            admin.userId = userRecord.uid;
            res.status(201).send(admin.convertToJSON());
        }).catch((error) => {
            console.log('Error updating database for new user:', error);
            res.status(500).send(error.message);
        });
    }).catch((error) => {
        console.log('Error creating new user:', error);
        res.status(500).send(error.message);
    });
}

// Checked
export async function deleteAccount(req, res) {
    console.log('deleteAccount');
    
    const query = req.query;
    if (!query || !query.userId) {
        res.status(400).send('Missing required parameters.');
        return;
    }

    console.log('Query: ', query);

    await adminAuth.deleteUser(query.userId).then(async () => {
        const userRef = firestore.collection(process.env.USERS_COLLECTION).doc(query.userId);

        const userSnapshot = await userRef.get();
        if (userSnapshot.data() === undefined) {
            res.status(404).send('User not found.');
            return;
        }

        if (userSnapshot.data().role === 'student') {
            const walletRef = firestore.collection(process.env.WALLETS_COLLECTION).doc(query.userId);
            const walletSnapshot = await walletRef.get();
            if (walletSnapshot.data() !== undefined) {
                walletRef.delete();
            }
        }

        userRef.delete();

        res.status(204).send('Successfully deleted user.');
    })
    .catch((error) => {
        console.log('Error deleting user:', error);
        res.status(500).send(error.message);
    });
}

// Checked
export async function updateProfile(req, res) {
    console.log('updateProfile');
    
    const body = req.body;
    const query = req.query;
    if (!body || !query || !query.userId) {
        res.status(400).send('Missing required parameters.');
        return;
    }

    console.log('Body: ', body);
    // const updateInfo = JSON.parse(body);

    const userRef = firestore.collection(process.env.USERS_COLLECTION).doc(query.userId);
    const userSnapshot = await userRef.get();
    if (userSnapshot.data() === undefined) {
        res.status(404).send('User not found.');
        return;
    }

    const batch = firestore.batch();

    batch.update(userRef, body);

    await batch.commit().then(() => {
        res.status(201).send('Successfully updated user.');
    })
    .catch((error) => {
        console.log('Error updating user:', error);
        res.status(500).send(error.message);
    })
}

// Checked
export async function getUserProfileById(req, res) {
    console.log('getProfileById');
    
    const query = req.query;
    if (!query || !query.userId) {
        res.status(400).send('Missing required parameters.');
        return;
    }

    console.log('Query: ', query);

    const userRef = firestore.collection(process.env.USERS_COLLECTION).doc(query.userId);
    await userRef.get().then((userSnapshot) => {
        if (userSnapshot.data() === undefined) {
            res.status(404).send('User not found.');
            return;
        }
        res.status(200).send(userSnapshot.data());
    })
    .catch((error) => {
        res.status(500).send(error.message);
    })
}

// Checked
export async function getUserProfileByEmail(req, res) {
    console.log('getProfileByEmail');

    const query = req.query;
    if (!query || !query.email) {
        res.status(400).send('Missing required parameters.');
        return;
    }

    console.log('Query: ', query);
    const ftQuery = firestore.collection(process.env.USERS_COLLECTION).where('email', '==', query.email);
    await ftQuery.get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            res.status(404).send('No user not found.');
            return;
        }
        res.status(200).send(querySnapshot.docs[0].data());
    })
    .catch((error) => {
        res.status(500).send(error.message);
    })
}

// Checked
export async function getUserIdByEmail(req, res) {
    console.log('getUserByEmail');
    const query = req.query;

    if (!query || !query.email) {
        res.status(400).send('Missing required parameters.');
        return;
    }

    console.log('Query: ', query);

    await adminAuth.getUserByEmail(query.email).then((userRecord) => {
        res.status(200).send(userRecord.uid);
    })
    .catch((error) => {
        res.status(500).send(error.message);
    });
}

// Checked
export async function updatePicture(req, res) {
    console.log('updateAvatar');

    if (!req.file || !req.query || !req.query.userId || !req.query.type) {
        res.status(400).send('Missing required parameters.');
        return;
    }

    const workingType = req.query.type;
    if (workingType !== 'avatar' && workingType !== 'coverPhoto') {
        res.status(400).send('Invalid type.');
        return;
    }
    
    const userRef = firestore.collection(process.env.USERS_COLLECTION).doc(req.query.userId);

    const userSnapshot = await userRef.get();
    if (userSnapshot.data() === undefined) {
        res.status(404).send('User not found.');
        return;
    }

    if (workingType === 'avatar') {
        if (userSnapshot.data().avatar) {
            const avatarId = userSnapshot.data().avatar;
            googleDrive.files.delete({ fileId: avatarId }).then(() => {
                console.log('Avatar deleted successfully.');
            }).catch((error) => {
                console.log('Error deleting avatar: ', error);
                res.status(500).send(error).message;
            });
        }
    }
    else {
        if (userSnapshot.data().coverPhoto) {
            const coverPhotoId = userSnapshot.data().coverPhoto;
            googleDrive.files.delete({ fileId: coverPhotoId }).then(() => {
                console.log('Cover photo deleted successfully.');
            }).catch((error) => {
                console.log('Error deleting cover photo: ', error);
                res.status(500).send(error).message;
            });
        }
    }

    const fileBuffer = Buffer.from(req.file.buffer);
    const fileStream = new Readable();
    fileStream.push(fileBuffer);
    fileStream.push(null);

    const mimeType = req.file.mimetype;
    const userID = req.query.userId;
    const fileMetadata = {
        name: userID,
        parents: workingType === 'avatar' ? [process.env.AVATARS_FOLDER_ID] : [process.env.COVERPHOTOS_FOLDER_ID]
    };

    googleDrive.files.create({
        resource: fileMetadata,
        media: {
            body: fileStream,
            mimeType: mimeType
        },
        fields: 'id'
    }, async (error, response) => {
        if (error) {
            console.log('Error creating file: ', error);
            res.status(500).send(error.message);
        }
        else {
            console.log('File ID: ', response.data.id);
            const updateData = workingType === 'avatar' ? { avatar: response.data.id } : { coverPhoto: response.data.id };
            await userRef.update(updateData).then(() => {
                res.status(201).send(response.data.id);
            }).catch((error) => {
                console.log('Error updating avatar: ', error);
                res.status(500).send(error.message);
            });
        }
    });
}

// Check
export async function getPicture(req, res) {
    console.log('getAvatar');

    if (!req.query || !req.query.userId || !req.query.type) {
        res.status(400).send('Missing required parameters.');
        return;
    }

    const workingType = req.query.type;

    if (workingType !== 'avatar' && workingType !== 'coverPhoto') {
        res.status(400).send('Invalid type.');
        return;
    }

    try {
        const userRef = firestore.collection(process.env.USERS_COLLECTION).doc(req.query.userId);
        const userSnapshot = await userRef.get();
        if (userSnapshot.data() === undefined) {
            res.status(404).send('User not found.');
            return;
        }
        const user = userSnapshot.data();
        if (workingType === 'avatar' && !user.avatar) {
            res.status(404).send('Avatar not found.');
            return;
        }
        if (workingType === 'coverPhoto' && !user.coverPhoto) {
            res.status(404).send('Cover photo not found.');
            return;
        }

        const fileId = workingType === 'avatar' ? user.avatar : user.coverPhoto;
        const response = await googleDrive.files.get({
            fileId: fileId,
            alt: 'media'
        }, {
            responseType: 'stream'
        });
        if (!response.data) {
            res.status(404).send('File not found.');
            return;
        }

        res.set({
            'Content-Type': response.headers['content-type'],
            'Content-Disposition': `attachment; filename="${fileId}"`,
        });

        response.data
            .on('end', () => {
                console.log('File downloaded successfully.');
            })
            .on('error', (error) => {
                console.log('Error pipe: ', error);
                res.status(500).send(error.message);
            })
            .pipe(res);
    } catch (error) {
        console.log('Error getting avatar: ', error);
        res.status(500).send(error.message);
    }
}

export function createResetPasswordLink(req, res) {
    console.log('createResetPasswordLink');

    if (!req.query || !req.query.email) {
        res.status(400).send('Missing required parameters.');
        return;
    }

    const email = req.query.email;
    adminAuth.generatePasswordResetLink(email)
        .then((link) => {
            console.log('Password reset link: ', link);
            res.send(link);
        })
        .catch((error) => {
            console.log('Error generating password reset link: ', error);
            res.status(500).send(error.message);
        });
}

export function createEmailVertificationLink(req, res) {
    console.log('createEmailVertificationLink');

    if (!req.query || !req.query.email) {
        res.status(400).send('Missing required parameters.');
        return;
    }

    const email = req.query.email;
    adminAuth.generateEmailVerificationLink(email)
        .then((link) => {
            console.log('Email verification link: ', link);
            res.send(link);
        })
        .catch((error) => {
            console.log('Error generating email verification link: ', error);
            res.status(500).send(error.message);
        });
}