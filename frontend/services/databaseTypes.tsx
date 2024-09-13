 export type Classdata = {
        classes: Array<TimeTables>;
        semester: string;
        targetedSemester: number;
        _id: string;
    }

    export type ClassType = {
    acronym: string;
    color: string;
    name: string;
    _id: string;
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
    shortName: string;
    }

  export type TimeTables ={
        //TODO: check this shit sometimes
        _id: string;
        classType: ClassType;
        organizer: Organizer;
        periods: Array<Periods>;
        room: Room;
        studentGroups: Array<number>;
        subject: Subject;
    }