import { Router } from 'express';
const router = Router();
import { register, deleteAccount, updateProfile, getUserProfileById, getUserProfileByEmail, getUserIdByEmail, updateAvatar, getAvatar, test} from '../../controllers/web_controllers/HCMUT_SSO.js';

import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const upload_file = multer({ dest: 'file-uploads' });

// Input: email, password, name
// Output: user information as JSON
router.post('/register', upload.single(''), register)

// Input: userId
router.delete('/delete-account', deleteAccount)

// Input: updateInfo, userId
// updateInfo: a json object containing information to be updated
router.patch('/update-profile', upload.single(''), updateProfile)

// Input: userId
// Output: user information as JSON
router.get('/get-user-profile-by-id', getUserProfileById)

// Input: email
// Output: user information as JSON
router.get('/get-user-profile-by-email', getUserProfileByEmail)

// Input: email
// Output: userId
router.get('/get-user-id-by-email', getUserIdByEmail)

// Input: form-data
    // fileBlob: file avatar
    // userId: userId
// Output: fileId
router.post('/update-avatar', upload_file.single('fileBlob'), updateAvatar)

// Input: userId
// Output: file as a blod object
router.get('/get-avatar', getAvatar)

router.patch('/test', upload.single(''), test)

export default router;
