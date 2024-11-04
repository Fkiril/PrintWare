import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function getHomePage(req, res) {
    res.sendFile(join(__dirname, '../../web/build/index.html'));
    console.log('getHomePage');
}

export function getDashboard(req, res) {
    console.log('getDashboard');
    res.send('This is the web dashboard page.');
}
