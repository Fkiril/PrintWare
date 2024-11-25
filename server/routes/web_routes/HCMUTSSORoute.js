import { Router } from 'express';
const router = Router();
import { adminRegister, register, deleteAccount, updateProfile, getUserProfileById, getUserProfileByEmail, getUserIdByEmail, updateAvatar, getAvatar, createResetPasswordLink, createEmailVertificationLink, test} from '../../controllers/web_controllers/HCMUT_SSO.js';

import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// const upload_file = multer({ dest: 'file-uploads' });

// Input:
    // form-data: email, password, userName
// Output: user information as JSON
router.post('/admin-register', upload.single(''), adminRegister)

// Input:
    // form-data: email, password, name
// Output: user information as JSON
router.post('/register', upload.single(''), register)

// Input:
    // query: userId
router.delete('/delete-account', deleteAccount)

// Input:
    // form-data: updateInfo
    // query: userId
router.patch('/update-profile', upload.single(''), updateProfile)

// Input:
    // query: userId
// Output: user information as JSON
router.get('/get-user-profile-by-id', getUserProfileById)

// Input:
    // query: email
// Output: user information as JSON
router.get('/get-user-profile-by-email', getUserProfileByEmail)

// Input:
    // query: email
// Output: userId
router.get('/get-user-id-by-email', getUserIdByEmail)

// Input:
    // form-data {fileBlob: file avatar}
    // query: userId
// Output: fileId
router.post('/update-avatar', upload.single('file'), updateAvatar)

// Input:
    // query: userId
// Output: file as a blod object
router.get('/get-avatar', getAvatar)


// Input:
    // query: email
// Output: reset password link
router.get('/get-reset-password-link', createResetPasswordLink)

// Input:
    // query: email
// Output: email verification link
router.get('/get-email-verification-link', createEmailVertificationLink)

// router.post('/test', upload.single('file'), test)

export default router;
