 export type Classdata = {
        classes: Array<TimeTables>;
        groups: Array<ClassType>;
        schedules: Array<Schedule>;
        semester: string;
        weekdays: Array<number>;
        _id: string;
    }

    export type ClassType = {
    acronym: string;
    color: string;
    name: string;
    _id: string;
    }

    export type Schedule = {
    _id: string;
    weekdays: Array<number>;
    periods: Array<Periods>;
    }

    export type Organizer = {
    _id: string;
    fristName: string;
    fullName: string;
    lastname: string;
    middleName: string;
    }

    export type Periods = {
        _id: string;
        weekdays: Array<number>;
        startTime: string;
        order: number;
        endTime: string;
    }

    export type RoomType = {
        _id: string;
        name: string;
    }

    export type Room = {
    _id: string;
    capacity: number | null;
    number: string;
    numberSecondary: string;
    roomNumber: string;
    type: RoomType;
    }

    export type Subject = {
    _id: string;
    name: string;
    code: string;
    shortName: string;
    isElective: boolean;
    targetedSemesters: Array<number>;
    classTypes: Array<ClassType>;
    }

    export type Classes = {
        _id: string;
        organizer: string;
        subject: string;
        classType: string;
        studentGroups: Array<number>;
        periodBlocks: Array<number>;
        room: string;
        weekday: number;
    }

    export type Semesters = {
        _id: string;
        academicYear: string;
        index: number;
        subjects: Array<Subject>;
    }

  export type TimeTables = {
        _id: string;
        semester: Semesters;
        targetedSemester: number;
        schedules: Schedule;
        classes: Classes;
    }

    export type Courses = {
        _id: string;
        code: string;
        name: string;
        specialization: string;
        cycle: number;
        degree: number;
        mode: boolean;
        startDate: string;
        semesterCount: number;
        semesters: Array<Semesters>;
        electiveSubjects: Array<Subject>;
    }

    export type Users = {
    _id: string;
    username: string;
    password: string;
    fullName: string;
    title: string;
    email: string;
    courses: Courses;
    role: number;
    }

 export type SubjectDetails = {
     _id: string;
     course: string;
     subject: {
         _id: string;
         code: string;
         name: string;
         shortName: string;
         isElective: boolean;
         targetedSemesters: number[];
     };
     details: [{
         classType: {
             name: string;
             acronym: string;
             color: string;
         };
         weeklyBlockCount: number;
     }];
 };