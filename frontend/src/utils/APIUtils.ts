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
    weekday: number;
    periodBlocks: number[];
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
    semester: string;
    studentGroups: number[];
};
type ClassTypePopulated = {
    _id: string;
    name: string;
    acronym: string | null;
    color: string | null;
};
type RoomPopulated = {
    _id: string;
    number: string | null; // TODO: remove null
    numberSecondary: string | null;
    capacity: number | null;
    roomNumber: string;
};
type SemesterPopulated = {
    _id: string;
    academicYear: string;
    index: number;
    subjects: Pick<SubjectPopulated, '_id' | 'classTypes'>[];
};
type SubjectPopulated = {
    _id: string;
    code: string;
    name: string;
    shortName: string | null;
    isElective: boolean;
    targetedSemesters: number[];
    classTypes: Omit<ClassTypePopulated, 'color'>[] | null; // TODO: remove null
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
    // Class
    static isProfessorBusy(classes: ClassPopulated[], userId: string, weekday: EWeekday, periodBlock: number) {
        if (!classes || !userId || !weekday || !periodBlock) {
            return null;
        }

        try {
            for (const c of classes) {
                if (c.organizer._id === userId && c.weekday === weekday && c.periodBlocks.includes(periodBlock)) {
                    return true;
                }
            }
        } catch (err) {
            console.error(err);
        }

        return false;
    }
    static isRoomOccupied(classes: ClassPopulated[], roomId: string, weekday: EWeekday, periodBlock: number) {
        if (!classes || !roomId || !weekday || !periodBlock) {
            return null;
        }

        try {
            for (const c of classes) {
                if (c.room._id === roomId && c.weekday === weekday && c.periodBlocks.includes(periodBlock)) {
                    return true;
                }
            }
        } catch (err) {
            console.error(err);
        }

        return false;
    }
    static isStudentGroupBusy(classes: ClassPopulated[], classTypeId: string, semesterId: string, groupNumber: number, weekday: EWeekday, periodBlock: number) {
        if (!classes || !classTypeId || !semesterId || !groupNumber || !weekday || !periodBlock) {
            return null;
        }

        try {
            for (const c of classes) {
                if (
                    c.semester === semesterId
                    && c.classType._id === classTypeId
                    && c.studentGroups.includes(groupNumber)
                    && c.weekday === weekday
                    && c.periodBlocks.includes(periodBlock)
                ) {
                    return true;
                }
            }
        } catch (err) {
            console.error(err);
        }

        return false;
    }
    static getUnoccupiedRooms(classes: ClassPopulated[], rooms: RoomPopulated[], weekday: EWeekday, periodBlock: number) {
        if (!classes || !rooms || !weekday || !periodBlock) {
            return null;
        }

        const unoccupiedRooms: RoomPopulated[] = [];
        try {
            for (const r of rooms) {
                if (!this.isRoomOccupied(classes, r._id, weekday, periodBlock)) {
                    unoccupiedRooms.push(r);
                }
            }
        } catch (err) {
            console.error(err);
        }

        return unoccupiedRooms.sort((a, b) => a._id.localeCompare(b._id));
    }

    // Semester
    static getSemesterClassTypes(semesters: SemesterPopulated[], semesterId: string) {
        if (!semesters || !semesterId) {
            return null;
        }

        const semesterSubjects: Pick<SubjectPopulated, '_id' | 'classTypes'>[] = [];
        try {
            for (const s of semesters) {
                if (s._id === semesterId) {
                    for (const sb of s.subjects) {
                        semesterSubjects.push(sb);
                    }
                }
            }
        } catch (err) {
            console.error(err);
        }

        const classTypes: Omit<ClassTypePopulated, 'color'>[] = [];
        try {
            for (const s of semesterSubjects) {
                if (s.classTypes) {
                    for (const sb of s.classTypes) {
                        classTypes.push(sb);
                    }
                }
            }
        } catch (err) {
            console.error(err);
        }

        const classTypesUnique = [...new Map(classTypes.map(item => [item['_id'], item])).values()];
        return classTypesUnique.sort((a, b) => a._id.localeCompare(b._id));
    }

    // SubjectDetails
    static getSubjectDetailsForSpecificSemesters(subjectDetails: SubjectDetailsPopulated[], targetedSemesters: number[]) {
        if (!subjectDetails || !targetedSemesters) {
            return null;
        }

        const newSubjectDetails: SubjectDetailsPopulated[] = [];
        try {
            for (const subjectDetail of subjectDetails) {
                if (targetedSemesters.every(v => subjectDetail.subject.targetedSemesters.includes(v))) {
                    newSubjectDetails.push(subjectDetail);
                }
            }
        } catch (err) {
            // console.error(err);
        }

        return newSubjectDetails;
    }
}
