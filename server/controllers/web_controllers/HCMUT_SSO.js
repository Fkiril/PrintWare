import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { adminAuth, firestore } from '../../services/FirebaseAdminSDK.js';
import { googleDrive } from '../../services/GoogleSDK.js';

import { Student, SPSO } from '../../models/User.js';

//13TqG02bA2rJnMoUDOw5i2haZINNm38Af
export async function test(req, res) {
    console.log('test');
    console.log("query: ", req.query);

    if (!req.query || !req.query.fileId) {
        res.status(400).send('Missing required parameters.');
        return;
    }
    else {
        try {
            const fileId = req.query.fileId;
            const response = await googleDrive.files.get({
                fileId: fileId,
                alt: 'media'
            }, {
                responseType: 'stream'
            });

            res.set({
                'Content-Type': response.headers['content-type'],
                'Content-Disposition': `attachment; filename="${fileId}"`,
            });

            response.data
                .on('end', () => {
                    console.log('File downloaded successfully.');
                })
                .on('error', (err) => {
                    console.log('Error: ', err);
                    res.status(500).send(err);
                })
                .pipe(res);
        } catch (error) {
            console.log('Error: ', error);
            res.status(500).send(error);
        }
    }

    // res.send("Request received!");
}

export async function updateAvatar(req, res) {
    console.log('updateAvatar');

    if (!req.file || !req.body || !req.query || !req.query.userId) {
        res.status(400).send('Missing required parameters.');
        return;
    }
    else {
        const userRef = firestore.collection('users').doc(req.query.userId);

        await userRef.get().then((userSnapshot) => {
            if (userSnapshot.empty) {
                res.status(404).send('User not found.');
                return;
            }

            const user = userSnapshot.data();
            if (user.avatar) {
                const response = googleDrive.files.delete({ fileId: user.avatar }).execute();

                response.then(() => {
                    console.log('Avatar deleted successfully.');
                }).catch((error) => {
                    res.status(500).send(error);
                });
            }
        }).catch((error) => {
            res.status(500).send(error);
        });

        const filePath = join(fileURLToPath(import.meta.url), '../../../file-uploads', req.file.filename);
        const mimeType = req.file.mimetype;
        const userID = req.body.userId;
        const fileMetadata = {
            name: userID,
            parents: [process.env.AVATARS_FOLDER_ID]
        };

        googleDrive.files.create({
            resource: fileMetadata,
            media: {
                body: fs.createReadStream(filePath),
                mimeType: mimeType
            },
            fields: 'id'
        }, async (err, response) => {
            if (err) {
                console.log('Error: ', err);
                res.status(500).send(err);
            }
            else {
                await fs.unlink(filePath).then(() => {
                    console.log('File deleted successfully.');
                }).catch((error) => {
                    console.log('Error deleting file: ', error);
                })

                console.log('File ID: ', response.data.id);
                await userRef.update({ avatar: response.data.id }).then(() => {
                    res.status(200).send(response.data.id);
                }).catch((error) => {
                    console.log('Error: ', error);
                    res.status(500).send(error);
                });
            }
        });
    }
}

export async function getAvatar(req, res) {
    console.log('getAvatar');

    if (!req.query || !req.query.fileId) {
        res.status(400).send('Missing required parameters.');
        return;
    }
    else {
        try {
            const fileId = req.query.fileId;
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
                .on('error', (err) => {
                    console.log('Error: ', err);
                    res.status(500).send(err);
                })
                .pipe(res);
        } catch (error) {
            console.log('Error: ', error);
            res.status(500).send(error);
        }
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
export function register(req, res) {
    console.log('Received a register request!');
    const query = req.query;

    if (!query || !query.email || !query.password || !query.userName) {
        res.status(400).send('Missing required parameters.');
        return;
    }

    console.log('Query: ', query);
    
    adminAuth.createUser({
        email: query.email,
        password: query.password,
        displayName: query.userName
    }).then((userRecord) => {
        const user = new Student();
        user.setInfoFromJSON(query);
        firestore.collection('users').doc(userRecord.uid).set(user.convertToJSON());

        res.status(200).send(user.convertToJSON());
    }).catch((error) => {
        console.log('Error creating new user:', error);
        res.status(500).send(error.message);
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

// Checked
export async function deleteAccount(req, res) {
    console.log('deleteAccount');
    
    const query = req.query;
    if (!query || !query.userId) {
        res.status(400).send('Missing required parameters.');
        return;
    }

    console.log('Query: ', query);

    adminAuth.deleteUser(query.userId).then(async () => {
        const userRef = firestore.collection('users').doc(query.userId);

        await userRef.get().then((userSnapshot) => {
            if (userSnapshot.empty) {
                req.status(404).send('User\'s profile not found.');
            }

            if (userSnapshot.data().role === 'student') {
                const walletRef = firestore.collection('wallet').doc(query.userId);

                if (walletRef) walletRef.delete();
            }
        })

        if (userRef) userRef.delete();

        res.status(200).send('Successfully deleted user.');
    })
    .catch((error) => {
        res.status(500).send(error.message);
    });
}

// Checked
export async function updateProfile(req, res) {
    console.log('updateProfile');
    
    const query = req.query;
    if (!query || !query.updateInfo || !query.userId) {
        res.status(400).send('Missing required parameters.');
        return;
    }

    console.log('Query: ', query);
    const updateInfo = JSON.parse(query.updateInfo);

    const userRef = firestore.collection('users').doc(query.userId);
    if (userRef) {
        const batch = firestore.batch();

        batch.update(userRef, updateInfo);

        batch.commit().then(() => {
            res.status(200).send('Successfully updated user.');
        })
        .catch((error) => {
            res.status(500).send(error.message);
        })
    }
    else {
        res.status(404).send('User not found.');
        return;
    }
}

export async function getUserProfileById(req, res) {
    console.log('getProfileById');
    
    const query = req.query;
    if (!query || !query.userId) {
        res.status(400).send('Missing required parameters.');
        return;
    }

    console.log('Query: ', query);

    const userRef = firestore.collection('users').doc(query.userId);
    await userRef.get().then((userSnapshot) => {
        if (userSnapshot.empty) {
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
    const ftQuery = firestore.collection('users').where('email', '==', query.email);
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
export function getUserIdByEmail(req, res) {
    console.log('getUserByEmail');
    const query = req.query;

    if (!query || !query.email) {
        res.status(400).send('Missing required parameters.');
        return;
    }

    console.log('Query: ', query);

    adminAuth.getUserByEmail(query.email).then((userRecord) => {
        res.status(200).send(userRecord.uid);
    })
    .catch((error) => {
        res.status(500).send(error.message);
    });
}