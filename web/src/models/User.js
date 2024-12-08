class IUser {
    userName = '';
    userId = '';
    userRole = '';
    email = '';

    constructor(userName = '', userId = '', userRole = '', email = '') {
        this.userName = userName;
        this.userId = userId;
        this.userRole = userRole;
        this.email = email;
    }
}

export class Customer extends IUser {
    phoneNum = '';
    hcmutId = '';
    faculty = '';
    major = '';
    academicYear = '';
    classId = '';
    avatar = '';
    coverPhoto = '';
    documents = [];

    constructor(userName = '', userId = '', userRole = '', email = '', phoneNum = '', hcmutId = '', faculty, major = '', academicYear = '', classId = '', avatar = '', coverPhoto = '', documents = []) {
        super(userName, userId, userRole, email);
        this.phoneNum = phoneNum;
        this.hcmutId = hcmutId;
        this.faculty = faculty;
        this.major = major;
        this.academicYear = academicYear;
        this.classId = classId;
        this.avatar = avatar;
        this.coverPhoto = coverPhoto;
        this.documents = documents;
    }
}

export class SPSO extends IUser {
    highestAuthority = false;

    constructor(userName = '', userId = '', userRole = '', email = '', highestAuthority = false) {
        super(userName, userId, userRole, email);
        this.highestAuthority = highestAuthority;
    }
}

export const CustomerModelKeys = {
    userName: 'userName',
    userId: 'userId',
    userRole: 'userRole',
    email: 'email',
    phoneNum: 'phoneNum',
    hcmutId: 'hcmutId',
    faculty: 'faculty',
    major: 'major',
    academicYear: 'academicYear',
    classId: 'classId',
    avatar: 'avatar',
    coverPhoto: 'coverPhoto',
    documents: 'documents'
}

export const SPSOModelKeys = {
    userName: 'userName',
    userId: 'userId',
    userRole: 'userRole',
    email: 'email',
    phoneNum: 'phoneNum',
    highestAuthority: 'highestAuthority'
}