import { Router } from 'express';
const router = Router();
import { register, deleteAccount, updateProfile, getUserProfileById, getUserProfileByEmail, getUserIdByEmail, updateAvatar, test} from '../../controllers/web_controllers/HCMUT_SSO.js';

// Input: email, password, name
// Output: IUser object toJSON
router.get('/register', register)

// Input: userId
router.get('/delete-account', deleteAccount)

// Input: updateInfo, userId
// updateInfo: a json object containing information to be updated
router.get('/update-profile', updateProfile)

// Input: userId
// Output: IUser object toJSON
router.get('/get-user-profile-by-id', getUserProfileById)

// Input: email
// Output: IUser object toJSON
router.get('/get-user-profile-by-email', getUserProfileByEmail)

// Input: email
// Output: userId
router.get('/get-user-id-by-email', getUserIdByEmail)

import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ dest: 'file-uploads' });

// Input: form-data
// fileBlob: file avatar
// userId
// Output: fileId
router.post('/update-avatar', upload.single('fileBlob'), updateAvatar)

router.get('/test', test)

export default router;
