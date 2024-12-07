import { Router } from 'express';
const router = Router();
import { adminRegister, register, deleteAccount, updateProfile, getUserProfileById, getUserProfileByEmail, getUserIdByEmail, uploadPicture, getPicture, createResetPasswordLink, createEmailVertificationLink, getDocIdList} from '../../controllers/web_controllers/HCMUT_SSO.js';

import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// const upload_file = multer({ dest: 'file-uploads' });

// Input:
    // form-data: email, password, userName
// Output: user information as JSON
router.post('/admin-register', upload.single(''), async (req, res) => {
    console.log('Received a admin register request!');
    const body = req.body;

    if (!body || !body.email || !body.password || !body.userName) {
        res.status(400).json({ oke: false, message: 'Missing required parameters.' });
        return;
    }

    const result = await adminRegister(body);

    res.status(result.status).json(result.body);
})

// Input:
    // form-data: email, password, name
// Output: user information as JSON
router.post('/register', upload.single(''), async (req, res) => {
    console.log('Received a register request!');
    const body = req.body;

    if (!body || !body.email || !body.password || !body.userName) {
        res.status(400).json({ oke: false, message: 'Missing required parameters.' });
        return;
    }

    const result = await register(body);

    res.status(result.status).json(result.body); 
})

// Input:
    // query: userId
router.delete('/delete-account', async (req, res) => {
    console.log('Received a delete account request!');

    const query = req.query;
    if (!query || !query.userId) {
        res.status(400).json({ oke: false, message: 'Missing required parameters.' });
        return;
    }

    const result = await deleteAccount(query.userId);

    res.status(result.status).json(result.body);
})

// Input:
    // form-data: updateInfo
    // query: userId
router.patch('/update-profile', upload.single(''), async (req, res) => {
    console.log('Received a update profile request!');

    const body = req.body;
    const query = req.query;
    if (!body || Object.keys(body).length === 0 || !query || !query.userId) {
        res.status(400).json({ oke: false, message: 'Missing required parameters.' });
        return;
    }

    const result = await updateProfile(query.userId, body);

    res.status(result.status).json(result.body);
})

// Input:
    // query: userId
// Output: user information as JSON
router.get('/get-user-profile-by-id', async (req, res) => {
    console.log('Received a get user profile by id request!');

    const query = req.query;
    if (!query || !query.userId) {
        res.status(400).json({ oke: false, message: 'Missing required parameters.' });
        return;
    }

    const result = await getUserProfileById(query.userId);

    res.status(result.status).json(result.body);
})

// Input:
    // query: email
// Output: user information as JSON
router.get('/get-user-profile-by-email', async (req, res) => {
    console.log('Received a get user profile by email request!');

    const query = req.query;
    if (!query || !query.email) {
        res.status(400).json({ oke: false, message: 'Missing required parameters.' });
        return;
    }

    const result = await getUserProfileByEmail(query.email);

    res.status(result.status).json(result.body);
})

// Input:
    // query: email
// Output: userId
router.get('/get-user-id-by-email', async (req, res) => {
    console.log('Received a get user id by email request!');

    const query = req.query;
    if (!query || !query.email) {
        res.status(400).json({ oke: false, message: 'Missing required parameters.' });
        return;
    }

    const result = await getUserIdByEmail(query.email);

    res.status(result.status).json(result.body);
})

// Input:
    // form-data {fileBlob: file avatar}
    // query: userId
    // query: type (avatar or coverPhoto)
// Output: fileId
router.post('/upload-picture', upload.single('file'), async (req, res) => {
    console.log('Received a update picture request!');

    const file = req.file;
    const query = req.query;
    console.log(file, query);
    if (!file || !query || !query.userId || !query.type) {
        res.status(400).json({ oke: false, message: 'Missing required parameters.' });
        return;
    }

    const result = await uploadPicture(file, query.userId, query.type);

    res.status(result.status).json(result.body);
})

// Input:
    // query: userId
    // query: type (avatar or coverPhoto)
// Output: file as a blod object
router.get('/get-picture', async (req, res) => {
    console.log('Received a get picture request!');

    const query = req.query;
    if (!query || !query.userId || !query.type) {
        res.status(400).json({ oke: false, message: 'Missing required parameters.' });
        return;
    }

    const result = await getPicture(query.userId, query.type);

    if (result.status !== 200) {
        res.status(result.status).json(result.body);
        return;
    }
    
    res.set({
        'Content-Type': result.body.data.contentType,
        'Content-Disposition': `attachment; filename="${result.body.data.fileId}"`,
    });

    result.body.file
        .on('end', () => {
            console.log('File downloaded successfully.');
        })
        .on('error', (error) => {
            console.log('Error pipe: ', error);
            res.status(500).json({ oke: false, message: error.message });
        })
        .pipe(res);
})


// Input:
    // query: email
// Output: reset password link
router.get('/get-reset-password-link', async (req, res) => {
    console.log('Received a get reset password link request!');

    const query = req.query;
    if (!query || !query.email) {
        res.status(400).json({ oke: false, message: 'Missing required parameters.' });
        return;
    }

    const result = await createResetPasswordLink(query.email);

    res.status(result.status).json(result.body);
})

// Input:
    // query: email
// Output: email verification link
router.get('/get-email-verification-link', async (req, res) => {
    console.log('Received a get email verification link request!');

    const query = req.query;
    if (!query || !query.email) {
        res.status(400).json({ oke: false, message: 'Missing required parameters.' });
        return;
    }

    const result = await createEmailVertificationLink(query.email);

    res.status(result.status).json(result.body);
})


// Input:
    // query: userId
// Output: docIdList
router.get('/get-doc-id-list', async (req, res) => {
    console.log('Received a get doc id list request!');

    const query = req.query;
    if (!query || !query.userId) {
        res.status(400).json({ oke: false, message: 'Missing required parameters.' });
        return;
    }

    const result = await getDocIdList(query.userId);

    res.status(result.status).json(result.body);
})

export default router;
