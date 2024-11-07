
export function getDashboard(req, res) {
    console.log('getDashboard');
    res.send('This is the web dashboard page.');
}

const sampleData = {
    message: 'Hello, this is data from the server!',
    date: new Date()
}

export function getSampleData(req, res) {
    console.log('User: ', req.headers['user-agent']);
    console.log('getSampleData');
    res.json(sampleData);
}