
export function getDashboard(req, res) {
    console.log('getDashboard');
    res.send('This is the web dashboard page.');
}

const sampleData = [
    {
        id: '001',
        message: 'Hello, this is data 001 from the server!',
        date: new Date()
    },
    {
        id: '002',
        message: 'Hello, this is data 002 from the server!',
        date: new Date()
    },
    {
        id: '003',
        message: 'Hello, this is data 003 from the server!',
        date: new Date()
    }
]

export function getSampleData(req, res) {
    console.log('getSampleData');
    console.log('User: ', req.headers['user-agent']);
    const query = req.query;

    if (req.headers['accept'].includes('application/json')) {
        if (query) {
            console.log('Query: ', query);
            if (query.id) {
                res.json(sampleData.filter(data => data.id === query.id));
            }
            return;
        }
        else {
            res.json(sampleData);
        }
    }
    else {
        res.send(sampleData);
    }
}