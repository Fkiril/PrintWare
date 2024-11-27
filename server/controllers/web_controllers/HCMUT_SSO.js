import { Readable } from 'stream';

import { adminAuth, firestore } from '../../services/FirebaseAdminSDK.js';
import { googleDrive } from '../../services/GoogleSDK.js';

import { Customer, SPSO } from '../../models/User.js';
import Wallet from '../../models/Wallet.js';

export async function test(req, res) {
    console.log('test');

    if (!req) {
        res.status(400).json({ message: 'Missing required parameters.' });
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
//         res.status(400).json({ message: 'Missing required parameters.' });
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
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    try {
        body['userRole'] = 'customer';
        console.log('Body: ', body);

        const checkUserRecord = await adminAuth.getUserByEmail(body.email);
        if (checkUserRecord !== undefined) {
            res.status(409).json({ message: 'Email already exists.' });
            return;
        }

        const userRecord = await adminAuth.createUser({
            email: body.email,
            password: body.password,
            displayName: body.userName
        });

        const user = new Customer();
        user.setInfoFromJSON(body);
        // const wallet = new Wallet();
        // wallet.setInfoFromJson({ ownerId: userRecord.uid });

        const batch = firestore.batch();
        const userRef = firestore.collection(process.env.USERS_COLLECTION).doc(userRecord.uid);
        // const walletRef = firestore.collection(process.env.WALLETS_COLLECTION).doc(userRecord.uid);

        batch.set(userRef, user.convertToJSON());
        batch.update(userRef, { userId: userRecord.uid })

        // batch.set(walletRef, wallet.convertToJSON());
        // batch.update(walletRef, { ownerId: userRecord.uid })

        batch.commit().then(() => {
            user.userId = userRecord.uid;
            res.status(201).json({ message: 'User created successfully.', user: user.convertToJSON() });
        }).catch((error) => {
            console.log('Error updating database for new user:', error);
            res.status(500).json({ message: error.message });
        });
    }
    catch (error) {
        console.log('Error creating new user:', error);
        res.status(500).json({ message: error.message });
    }
}


// Checked
export async function adminRegister(req, res) {
    console.log('adminRegister');

    const body = req.body;
    if (!req || !body|| !body.email || !body.password) {
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    try {
        body['userRole'] = 'admin';
        body['highestAuthority'] = false;
        console.log('Body: ', body);

        const checkUserRecord = await adminAuth.getUserByEmail(body.email);
        if (checkUserRecord !== undefined) {
            res.status(409).json({ message: 'Email already exists.' });
            return;
        }

        const userRecord = await adminAuth.createUser({
            email: body.email,
            password: body.password,
            displayName: body.userName
        });

        const admin = new SPSO();
        admin.setInfoFromJSON(body);

        const batch = firestore.batch();
        const adminRef = firestore.collection(process.env.ADMINS_COLLECTION).doc(userRecord.uid);

        batch.set(adminRef, admin.convertToJSON());
        batch.update(adminRef, { userId: userRecord.uid })

        batch.commit().then(() => {
            admin.userId = userRecord.uid;
            res.status(201).json({ message: 'Admin created successfully.', admin: admin.convertToJSON() });
        }).catch((error) => {
            console.log('Error updating database for new user:', error);
            res.status(500).json({ message: error.message });
        })
    }
    catch (error) {
        console.log('Error creating new user:', error);
        res.status(500).json({ message: error.message });
    }
}

// Checked
export async function deleteAccount(req, res) {
    console.log('deleteAccount');
    
    const query = req.query;
    if (!query || !query.userId) {
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    console.log('Query: ', query);

    await adminAuth.deleteUser(query.userId).then(async () => {
        const userRef = firestore.collection(process.env.USERS_COLLECTION).doc(query.userId);

        const userSnapshot = await userRef.get();
        if (userSnapshot.data() === undefined) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        if (userSnapshot.data().role === 'customer') {
            const walletRef = firestore.collection(process.env.WALLETS_COLLECTION).doc(query.userId);
            const walletSnapshot = await walletRef.get();
            if (walletSnapshot.data() !== undefined) {
                walletRef.delete();
            }
        }

        userRef.delete();

        res.status(200).json({ message: 'User deleted successfully.' });
    })
    .catch((error) => {
        console.log('Error deleting user:', error);
        res.status(500).json({ message: error.message });
    });
}

// Checked
export async function updateProfile(req, res) {
    console.log('updateProfile');
    
    const body = req.body;
    const query = req.query;
    if (!body || Object.keys(body).length === 0 || !query || !query.userId) {
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    try {
        console.log('Body: ', body);

        const invalidFields = Object.keys(body).filter(key => !Object.keys(Customer.prototype).includes(key));
        if (invalidFields.length > 0) {
            res.status(400).json({ message: `The following fields are invalid: ${invalidFields.join(', ')}.` });
            return;
        }

        const userRef = firestore.collection(process.env.USERS_COLLECTION).doc(query.userId);
        const userSnapshot = await userRef.get();
        if (userSnapshot.data() === undefined) {
            res.status(404).send('User not found.');
            return;
        }

        const batch = firestore.batch();

        batch.update(userRef, body);

        await batch.commit().then(() => {
            res.status(200).json({ message: 'User updated successfully.' });
        })
        .catch((error) => {
            console.log('Error updating user:', error);
            res.status(500).json({ message: error.message });
        });
    }
    catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: error.message });
    }
}

// Checked
export async function getUserProfileById(req, res) {
    console.log('getProfileById');
    
    const query = req.query;
    if (!query || !query.userId) {
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    console.log('Query: ', query);

    const userRef = firestore.collection(process.env.USERS_COLLECTION).doc(query.userId);
    await userRef.get().then((userSnapshot) => {
        if (userSnapshot.data() === undefined) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        res.status(200).json({ message: 'User found.', profile: userSnapshot.data() });
    })
    .catch((error) => {
        res.status(500).json({ message: error.message });
    })
}

// Checked
export async function getUserProfileByEmail(req, res) {
    console.log('getProfileByEmail');

    const query = req.query;
    if (!query || !query.email) {
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    console.log('Query: ', query);
    const ftQuery = firestore.collection(process.env.USERS_COLLECTION).where('email', '==', query.email);
    await ftQuery.get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        res.status(200).json({ message: 'User found.', profile: querySnapshot.docs[0].data() });
    })
    .catch((error) => {
        res.status(500).json({ message: error.message });
    })
}

// Checked
export async function getUserIdByEmail(req, res) {
    console.log('getUserByEmail');
    const query = req.query;

    if (!query || !query.email) {
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    console.log('Query: ', query);

    await adminAuth.getUserByEmail(query.email).then((userRecord) => {
        res.status(200).json({ message: 'User found.', userId: userRecord.uid });
    })
    .catch((error) => {
        if (error.code === 'auth/user-not-found') {
            res.status(404).json({ message: 'User not found.' });
        }
        else if (error.code === 'auth/invalid-email') {
            res.status(400).json({ message: 'Invalid email.' });
        }
        else {
            res.status(500).json({ message: error.message });
        }
    });
}

// Checked
export async function uploadPicture(req, res) {
    console.log('updateAvatar');

    if (!req.file || !req.query || !req.query.userId || !req.query.type) {
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    const workingType = req.query.type;
    if (workingType !== 'avatar' && workingType !== 'coverPhoto') {
        res.status(400).json({ message: 'Invalid type.' });
        return;
    }
    
    const userRef = firestore.collection(process.env.USERS_COLLECTION).doc(req.query.userId);

    const userSnapshot = await userRef.get();
    if (userSnapshot.data() === undefined) {
        res.status(404).json({ message: 'User not found.' });
        return;
    }

    if (workingType === 'avatar') {
        if (userSnapshot.data().avatar) {
            const avatarId = userSnapshot.data().avatar;
            googleDrive.files.delete({ fileId: avatarId }).then(() => {
                console.log('Avatar deleted successfully.');
            }).catch((error) => {
                console.log('Error deleting avatar: ', error);
                res.status(500).json({ message: error.message });
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
                res.status(500).json({ message: error.message });
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
            res.status(500).json({ message: error.message });
        }
        else {
            console.log('File ID: ', response.data.id);
            const updateData = workingType === 'avatar' ? { avatar: response.data.id } : { coverPhoto: response.data.id };
            await userRef.update(updateData).then(() => {
                res.status(201).json({ message: 'Avatar updated successfully.' });
            }).catch((error) => {
                console.log('Error updating avatar: ', error);
                res.status(500).json({ message: error.message });
            });
        }
    });
}

// Check
export async function getPicture(req, res) {
    console.log('getAvatar');

    if (!req.query || !req.query.userId || !req.query.type) {
        res.status(400).json({ message: 'Missing required parameters.' });
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
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        const user = userSnapshot.data();
        if (workingType === 'avatar' && !user.avatar) {
            res.status(404).json({ message: 'Avatar not found.' });
            return;
        }
        if (workingType === 'coverPhoto' && !user.coverPhoto) {
            res.status(404).json({ message: 'Cover photo not found.' });
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
            res.status(404).json({ message: 'File not found.' });
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
                res.status(500).json({ message: error.message });
            })
            .pipe(res);
    } catch (error) {
        console.log('Error getting avatar: ', error);
        res.status(500).json({ message: error.message });
    }
}

export async function createResetPasswordLink(req, res) {
    console.log('createResetPasswordLink');

    if (!req.query || !req.query.email) {
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    const email = req.query.email;
    console.log('Email: ', email);

    try {
        const userRecord = await adminAuth.getUserByEmail(email);
        if (userRecord === undefined) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        const link = await adminAuth.generatePasswordResetLink(email);
        if (link === undefined) {
            res.status(500).json({ message: 'Error generating password reset link.' });
            return;
        }

        res.status(200).json({ message: 'Password reset link generated successfully.', link: link });
    }
    catch (error) {
        console.log('Error generating password reset link: ', error);
        res.status(500).json({ message: error.message });
    }
}

export async function createEmailVertificationLink(req, res) {
    console.log('createEmailVertificationLink');

    if (!req.query || !req.query.email) {
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    const email = req.query.email;
    console.log('Email: ', email);

    try {
        const userRecord = await adminAuth.getUserByEmail(email);
        if (userRecord === undefined) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        const link = await adminAuth.generateEmailVerificationLink(email);
        if (link === undefined) {
            res.status(500).json({ message: 'Error generating email vertification link.' });
            return;
        }

        res.status(200).json({ message: 'Email vertification link generated successfully.', link: link });
    }
    catch (error) {
        console.log('Error generating email vertification link: ', error);
        res.status(500).json({ message: error.message });
    }
}

export async function getDocIdList(req, res) {
    console.log('getDocIdList');

    const query = req.query;
    if (!req || !query || !query.userId) {
        res.locals.ok = false;
        res.status(400).json({ message: 'Missing required parameters.' });
        return;
    }

    console.log('Query: ', query);
    try {
        const userRef = firestore.collection(process.env.USERS_COLLECTION).doc(query.userId);
        const userSnapshot = await userRef.get();
        if (userSnapshot.data() === undefined) {
            res.locals.ok = false;
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        
        const docIdList = userSnapshot.data().documents;
        res.status(200).json({ message: 'Document ID list retrieved successfully.', docIdList: docIdList });
    }
    catch (error) {
        console.log('Error getting docIdList: ', error);
        res.status(500).json({ message: error.message });
    }
}