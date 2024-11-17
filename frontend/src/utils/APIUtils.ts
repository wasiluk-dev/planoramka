import EWeekday from '../enums/EWeekday.ts';

// TODO: make all the types dynamic
type ClassPopulated = {
    _id: string;
    organizer: {
        _id: string;
        fullName: string;
    };
    subject: {
        _id: string;
        name: string;
        shortName: string | null;
    };
    classType: {
        _id: string;
        name: string;
        acronym: string;
        color: string;
    };
    periodBlocks: number[];
    weekday: number;
    studentGroups: number[];
    room: {
        _id: string;
        number: string;
        numberSecondary: string;
        type: {
            _id: string;
            name: string;
        } | null;
        capacity: number | null;
        roomNumber: string;
    };
};
type RoomPopulated = {
    _id: string;
    number: string;
    numberSecondary: string | null;
    type: {
        _id: string;
        name: string;
    } | null;
    capacity: number | null;
    roomNumber: string;
};
type SubjectDetailsPopulated = {
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

// TODO: change returning nulls to throwing errors
export default class APIUtils {
    static getSubjectDetailsForSpecificSemesters(subjectDetails: SubjectDetails[], targetedSemesters: number[]) {
        if(!subjectDetails || !targetedSemesters){
    // Class
    static isProfessorBusy(classes: ClassPopulated[], userId: string, weekday: EWeekday, periodBlock: number) {
        if (!classes || !userId || !weekday || !periodBlock) {
            return null;
        }

        for (const c of classes) {
            try {
                if (c.organizer._id === userId && c.weekday === weekday && c.periodBlocks.includes(periodBlock)) {
                    return true;
                }
            } catch (err) {
                console.error(err);
            }
        }

        return false;
    }
    static isRoomOccupied(classes: ClassPopulated[], roomId: string, weekday: EWeekday, periodBlock: number) {
        if (!classes || !roomId || !weekday || !periodBlock) {
            return null;
        }

        for (const c of classes) {
            try {
                if (c.room._id === roomId && c.weekday === weekday && c.periodBlocks.includes(periodBlock)) {
                    return true;
                }
            } catch (err) {
                console.error(err);
            }
        }

        return false;
    }

    // Room
    static getRoomsByType(rooms: RoomPopulated[], roomTypeId: string) {
        if (!rooms || !roomTypeId) {
            return null;
        }

        const roomsWithSpecifiedType: RoomPopulated[] = [];
        for (const r of rooms) {
            try {
                if (r.type?._id === roomTypeId) {
                    roomsWithSpecifiedType.push(r);
                }
            } catch (err) {
                console.error(err);
            }
        }

        return roomsWithSpecifiedType;
    }

    // SubjectDetails
    static getSubjectDetailsForSpecificSemesters(subjectDetails: SubjectDetailsPopulated[], targetedSemesters: number[]) {
        if (!subjectDetails || !targetedSemesters) {
            return null;
        }

        const newSubjectDetails: SubjectDetailsPopulated[] = [];
        for (const subjectDetail of subjectDetails) {
            try {
                if (targetedSemesters.every(v => subjectDetail.subject.targetedSemesters.includes(v))) {
                    newSubjectDetails.push(subjectDetail);
                }
            } catch (err) {
                // console.error(err);
            }
        }

        return newSubjectDetails;
    }
}
