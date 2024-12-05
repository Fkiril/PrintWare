export default class EnrollUser {
    static instance;
    constructor() {
        if (!EnrollUser.instance) {
            EnrollUser.instance = this;
            this.enrolledUsers = [];
        }
        return EnrollUser.instance;
    }

    static getInstance() {
        if (!EnrollUser.instance) {
            EnrollUser.instance = new EnrollUser();
        }
        return EnrollUser.instance;
    }

    AddEnrolledUser(userId, res) {
        this.enrolledUsers.push({ userId, res });
    }

    RemoveEnrolledUser(userId) {
        this.enrolledUsers = this.enrolledUsers.filter((user) => user.userId !== userId);
    }

    IsInEnrolledUsers(userId) {
        return this.enrolledUsers.some((user) => user.userId === userId);
    }

    GetEnrolledUser(userId) {
        return this.enrolledUsers.find((user) => user.userId === userId);
    }

    EnrollMiddleware(req, res) {
        console.log('EnrollMiddleware');

        if (!req || !req.query || !req.query.userId) {
            res.status(400).json({ message: 'Missing required parameters.' });
            return;
        }

        if (this.IsInEnrolledUsers(req.query.userId)) {
            res.status(208).json({ message: 'User is already enrolled.' });
        }
        else {
            this.AddEnrolledUser(req.query.userId);
            res.status(200).json({ message: 'User enrolled successfully.' });
        }
    }
}

