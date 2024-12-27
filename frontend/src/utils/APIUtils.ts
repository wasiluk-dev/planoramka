import {
    ClassPopulated,
    ClassTypePopulated,
    CoursePopulated,
    FacultyPopulated,
    PeriodPopulated,
    RoomPopulated,
    SemesterPopulated,
    SubjectDetailsPopulated,
    SubjectPopulated,
    TimetablePopulated,
    UserPopulated,
} from '../../services/databaseTypes.tsx';
import ECourseCycle from '../../../backend/src/enums/ECourseCycle.ts';
import EUserRole from '../../../backend/src/enums/EUserRole.ts';
import EWeekday from '../enums/EWeekday.ts';

type PeriodBlock = {
    classType: ClassTypePopulated;
    subject: Pick<SubjectPopulated, '_id' | 'name' | 'shortName'>;
    room: Pick<RoomPopulated, '_id' | 'roomNumber'>;
    period: Pick<PeriodPopulated, 'startTime' | 'endTime'>;
    faculty: Pick<FacultyPopulated, '_id' | 'name' | 'acronym'>;
    course: Pick<CoursePopulated, '_id' | 'code'>;
    semester: Pick<SemesterPopulated, '_id' | 'index'> & { year: number };
}

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
    static getProfessorClasses(classes: ClassPopulated[], timetables: TimetablePopulated[], faculties: FacultyPopulated[], userId: string) {
        const professorClasses: Record<EWeekday, PeriodBlock[]> = {
            0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
        };

        classes.filter((c) => (c.organizer?._id === userId))
            .map((c) => {
                const periods = this.getClassPeriods(timetables, c._id).sort((a, b) => a.startTime.localeCompare(b.startTime));
                let semester: SemesterPopulated | undefined;
                let course: Pick<CoursePopulated, '_id' | 'code' | 'name' | 'specialization' | 'semesters'> | undefined;
                const faculty = faculties.find(faculty => {
                    course = faculty.courses.find(course => {
                        semester = course.semesters.find(semester => semester._id === c.semester);
                        return semester;
                    });

                    return course;
                });

                if (!faculty || !course || !semester) {
                    return;
                }

                professorClasses[c.weekday as EWeekday].push({
                    classType: c.classType,
                    subject: {
                        _id: c.subject!._id,
                        name: c.subject!.name,
                        shortName: c.subject!.shortName,
                    },
                    room: {
                        _id: c.room._id,
                        roomNumber: c.room.roomNumber,
                    },
                    period: {
                        startTime: periods[0].startTime,
                        endTime: periods[periods.length - 1].endTime,
                    },
                    faculty: {
                        _id: faculty._id,
                        name: faculty.name,
                        acronym: faculty.acronym,
                    },
                    course: {
                        _id: course._id,
                        code: course.code,
                    },
                    semester: {
                        _id: semester._id,
                        index: semester.index,
                        year: Math.round(semester.index / 2),
                    },
                });
            });

        return professorClasses;
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

    // Faculties
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
    static getClassPeriods(timetables: TimetablePopulated[], classId: string) {
        const timetable = timetables.find(t =>
            t.classes.find(c => c._id === classId)
        );

        const timetableClass = timetable?.classes.find(c => c._id === classId)!;
        const timetableSchedule = timetable?.schedules.find(s =>
            s.weekdays.includes(timetableClass.weekday)
        )!;

        const periods = timetableSchedule.periods.filter(p => timetableClass?.periodBlocks.includes(p.order));
        return periods.sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
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
