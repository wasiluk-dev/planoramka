import EWeekday from '../enums/EWeekday.ts';
import {
    ClassPopulated,
    SemesterPopulated,
    SubjectDetailsPopulated,
    SubjectPopulated,
} from '../../services/DBTypes.ts';

// TODO: replace returning nulls with throwing errors
export default class APIUtils {
    // Class
    static isProfessorBusy(classes: ClassPopulated[], userId: string, weekday: EWeekday, periodBlock: number) {
        if (!classes || !userId || !weekday || !periodBlock) {
            return null;
        }

        try {
            for (const c of classes) {
                if (c.organizer?._id === userId && c.weekday === weekday && c.periodBlocks.includes(periodBlock)) {
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

    // Semesters
    static getSemesterClassTypes(semesters: SemesterPopulated[], semesterId: string) {
        if (!semesters) {
            return null;
        }

        const semesterSubjects: SubjectPopulated[] = [];
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

        const classTypes = [];
        try {
            for (const s of semesterSubjects) {
                if (s.classTypes) {
                    for (const sb of s.classTypes) {
                        classTypes.push(sb._id);
                    }
                }
            }
        } catch (err) {
            console.error(err);
        }

        return [...new Set(classTypes)].sort();
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
            console.error(err);
        }

        return newSubjectDetails;
    }
}
