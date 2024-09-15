 export type Classdata = {
        classes: Array<TimeTables>;
        schedules: Array<Schedule>;
        semester: string;
        targetedSemester: number;
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
    periods: Periods;
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
        endTime: string;
        isBreak: boolean;
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
    }

    export type Semesters = {
        _id: string;
        courseCode: string;
        number: number;
        subjectCount: number;
        subjects: Array<Subject>;
    }

  export type TimeTables ={
        _id: string;
        semester: Semesters;
        targetedSemester: number;
        schedules: Schedule;
        classes: Classes;
    }