import { Router } from 'express';
const router = Router();
import { register, deleteAccount, updateProfile, getProfile, getUserById, getUserByEmail, test} from '../../controllers/web_controllers/HCMUT_SSO.js';

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
router.get('/get-profile', getProfile)

// Input: userId
// Output: IUser object toJSON
router.get('/get-user-by-id', getUserById)

// Input: email
// Output: IUser object toJSON
router.get('/get-user-by-email', getUserByEmail)

router.get('/test', test)

export default router;
