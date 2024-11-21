class IUser {
    userName = '';
    userId = '';
    userRole = '';

    constructor(userName = '', userId = '', userRole = '') {
        this.userName = userName;
        this.userId = userId;
        this.userRole = userRole;
    }

    convertToJSON() {}
    setInfoFromJSON(json) {}
}

export class Student extends IUser {
    email = '';
    phoneNum = '';
    studentId = '';
    major = '';
    academicYear = '';

    constructor(userName = '', userId = '', email = '', phoneNum = '', studentId = '', major = '', academicYear = '') {
        super(userName, userId);
        this.email = email;
        this.phoneNum = phoneNum;
        this.studentId = studentId;
        this.major = major;
        this.academicYear = academicYear;
    }

    convertToJSON() {
        return {
            userName: this.userName?? "",
            userId: this.userId?? "",
            email: this.email?? "",
            phoneNum: this.phoneNum?? "",
            studentId: this.studentId?? "",
            major: this.major?? "",
            academicYear: this.academicYear?? ""
        };
    }

    setInfoFromJSON(json) {
        this.userName = json.userName?? "";
        this.userId = json.userId?? "";
        this.email = json.email?? "";
        this.phoneNum = json.phoneNum?? "";
        this.studentId = json.studentId?? "";
        this.major = json.major?? "";
        this.academicYear = json.academicYear?? "";
    }
}

export class SPSO extends IUser {
    authorityLevel = '';

    constructor(userName = '', userId = '', authorityLevel = '') {
        super(userName, userId);
        this.authorityLevel = authorityLevel;
    }

    convertToJSON() {
        return {
            userName: this.userName?? "",
            userId: this.userId?? "",
            authorityLevel: this.authorityLevel?? ""
        };
    }

    setInfoFromJSON(json) {
        this.userName = json.userName?? "";
        this.userId = json.userId?? "";
        this.authorityLevel = json.authorityLevel?? "";
    }
}