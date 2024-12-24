import EWeekday from '../enums/EWeekday.ts';
import {
    ClassPopulated,
    CoursePopulated, FacultyPopulated,
    RoomPopulated,
    SemesterPopulated,
    SubjectDetailsPopulated,
    TimetablePopulated, UserPopulated
} from '../../services/databaseTypes.tsx';
import ECourseCycle from '../../../backend/src/enums/ECourseCycle.ts';
import EUserRole from '../../../backend/src/enums/EUserRole.ts';

export default class APIUtils {
    // Class
    static isProfessorBusy(classes: ClassPopulated[], userId: string, weekday: EWeekday, periodBlock: number) {
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
        try {
            for (const c of classes) {
                if (
                    c.semester === semesterId
                    && c.classType._id === classTypeId
                    && c.studentGroups?.includes(groupNumber)
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

    // Courses
    static getCourseCycles(courses: CoursePopulated[]) {
        const degrees: ECourseCycle[] = [];
        for (const c of courses) {
            if (!degrees.includes(c.cycle)) {
                degrees.push(c.cycle);
            }
        }

        return degrees.sort((a, b) => a - b);
    }

    static getCoursesOfCycle(courses: CoursePopulated[], cycle: ECourseCycle) {
        const coursesOfCycle: CoursePopulated[] = [];
        for (const c of courses) {
            if (c.cycle === cycle) {
                coursesOfCycle.push(c);
            }
        }

        return coursesOfCycle;
    }

    static getFacultyCourses(faculties: FacultyPopulated[], facultyId: string) {
        for (const f of faculties) {
            if (f._id === facultyId) {
                return f.courses;
            }
        }
      
        return [];
    }

    // Semester
    static getSemesterClassTypes(semesters: SemesterPopulated[], semesterId: string) {
        const semesterSubjects: SemesterPopulated['subjects'] = [];
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

        const classTypes: NonNullable<TimetablePopulated['groups']>[number]['classType'][] = [];
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

    // Timetable
    static getTimetableGroupCounts(timetables: TimetablePopulated[], timetableId: string) {
        const groups: TimetablePopulated['groups'] = [];
        try {
            for (const t of timetables) {
                if (t._id === timetableId && t.groups) {
                    groups.push(...t.groups);
                }
            }
        } catch (err) {
            console.error(err);
        }

        const groupCounts: Record<number, NonNullable<TimetablePopulated['groups']>[number]['classType'][]> = {};
        try {
            for (const g of groups) {
                if (!groupCounts[g.groupCount]) {
                    groupCounts[g.groupCount] = [];
                }

                groupCounts[g.groupCount].push(g.classType);
            }
        } catch (err) {
            console.error(err);
        }

        return groupCounts;
    }

    // User
    static getFreeProfessors(users: UserPopulated[], classes: ClassPopulated[], weekday: EWeekday, periodBlock: number) {
        const freeProfessors: UserPopulated[] = [];
        for (const u of users) {
            if (u.role === EUserRole.Professor) {
                freeProfessors.push(u);
            }
        }

        try {
            for (const p of freeProfessors) {
                if (this.isProfessorBusy(classes, p._id, weekday, periodBlock)) {
                    const i: number = freeProfessors.indexOf(p);
                    if (i !== -1) {
                        freeProfessors.splice(i, 1);
                    }
                }
            }
        } catch (err) {
            console.error(err);
        }

        return freeProfessors.sort((a, b) => a.surnames.localeCompare(b.surnames));
    }
    static getUsersWithRole(users: UserPopulated[], role: EUserRole) {
        const usersWithRole: UserPopulated[] = [];
        try {
            for (const u of users) {
                if (u.role === role) {
                    usersWithRole.push(u);
                }
            }
        } catch (err) {
            console.error(err);
        }

        return usersWithRole;
    }
}
