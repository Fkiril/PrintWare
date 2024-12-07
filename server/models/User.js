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

    convertToJSON() {}
    setInfoFromJSON(json) {}
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

    convertToJSON() {
        return {
            userName: this.userName?? '',
            userId: this.userId?? '',
            userRole: this.userRole?? '',
            email: this.email?? '',
            phoneNum: this.phoneNum?? '',
            hcmutId: this.hcmutId?? '',
            faculty: this.faculty?? '',
            major: this.major?? '',
            academicYear: this.academicYear?? '',
            classId: this.classId?? '',
            avatar: this.avatar?? '',
            coverPhoto: this.coverPhoto?? '',
            documents: this.documents?? []
        };
    }

    setInfoFromJSON(json) {
        this.userName = json.userName?? '';
        this.userId = json.userId?? '';
        this.userRole = json.userRole?? '';
        this.email = json.email?? '';
        this.phoneNum = json.phoneNum?? '';
        this.hcmutId = json.hcmutId?? '';
        this.faculty = json.faculty?? '';
        this.major = json.major?? '';
        this.academicYear = json.academicYear?? '';
        this.classId = json.classId?? '';
        this.avatar = json.avatar?? '';
        this.coverPhoto = json.coverPhoto?? '';
        this.documents = json.documents?? [];
    }
}

export class SPSO extends IUser {
    highestAuthority = false;

    constructor(userName = '', userId = '', userRole = '', email = '', highestAuthority = false) {
        super(userName, userId, userRole, email);
        this.highestAuthority = highestAuthority;
    }

    convertToJSON() {
        return {
            userName: this.userName?? '',
            userId: this.userId?? '',
            userRole: this.userRole?? '',
            email: this.email?? '',
            highestAuthority: this.highestAuthority?? false
        };
    }

    setInfoFromJSON(json) {
        this.userName = json.userName?? '';
        this.userId = json.userId?? '';
        this.userRole = json.userRole?? '';
        this.email = json.email?? '';
        this.highestAuthority = json.highestAuthority?? false;
    }
}