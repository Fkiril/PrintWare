// printwarehk241@gmail.com - @PrintWare_hk241
// print-ware-hk241@printware-442312.iam.gserviceaccount.com
// Documents folder: 1suzmYdbpX75-Q1egaraurDvosiVUuVET
// Avatars folder: 1zXxnms1G9dOWTuCrWY_OUBy3jJ06xFk5

import { createReadStream } from 'fs';
import { google } from 'googleapis';
import GOOGLE_API_KEY from './google-api-key.json' assert { type: 'json' };
const SCOPE = ['https://www.googleapis.com/auth/drive'];

// A Function that can provide access to google drive api
async function googleAuthorize(){
    const jwtClient = new google.auth.JWT(
        GOOGLE_API_KEY.client_email,
        null,
        GOOGLE_API_KEY.private_key,
        SCOPE
    );
    await jwtClient.authorize();

    return jwtClient;
}

const jwtAuth = await googleAuthorize().then((jwtClient) => jwtClient);

const googleDrive = google.drive({ version: 'v3', auth: jwtAuth });

export { googleDrive };