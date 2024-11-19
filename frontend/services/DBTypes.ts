import ECourseCycle from '../../backend/src/enums/ECourseCycle';
import ECourseDegree from '../../backend/src/enums/ECourseDegree';
import ECourseMode from '../../backend/src/enums/ECourseMode.ts';
import EUserRole from '../../backend/src/enums/EUserRole.ts';

export type UserPopulated = {
    _id: string;
    username: string;
    password: string;
    fullName: string;
    // TODO: uncomment fields after implementing
    // title: EUserTitle | null;
    // email: string;
    courses: string[];
    role: EUserRole;
}

// courses
export type CoursePopulated = {
    _id: string;
    code: string;
    name: string;
    specialization: string | null;
    cycle: ECourseCycle;
    degree: ECourseDegree | null;
    mode: ECourseMode;
    semesters: SemesterPopulated[];
    electiveSubjects: string[];
}
export type ElectiveSubjectPopulated = {
    _id: string;
    name: string;
    subjects: string[];
}
export type SemesterPopulated = {
    _id: string;
    academicYear: string;
    index: number;
    subjects: Pick<SubjectPopulated, '_id' | 'classTypes'>[];
}
export type SubjectPopulated = {
    _id: string;
    code: string;
    name: string;
    shortName: string | null;
    isElective: boolean;
    targetedSemesters: number[];
    classTypes: Omit<ClassTypePopulated, 'color'>[];
}
export type SubjectDetailsPopulated = {
    _id: string;
    course: string;
    subject: Omit<SubjectPopulated, 'classTypes'>;
    details: [{
        classType: Omit<ClassTypePopulated, '_id'>;
        weeklyBlockCount: number;
    }];
}

// faculty
export type BuildingPopulated = {
    _id: string;
    name: string;
    acronym: string | null;
    address: string;
    rooms: RoomPopulated[];
}
export type FacultyPopulated = {
    _id: string;
    name: string;
    acronym: string | null;
    buildings: Omit<BuildingPopulated, 'address'>[];
    courses: Pick<CoursePopulated, '_id' | 'name' | 'semesters' | 'specialization'>[];
}
export type RoomPopulated = {
    _id: string;
    number: string | null; // TODO: remove null after fixing the example data
    numberSecondary: string | null;
    capacity: number | null;
    roomNumber: string; // virtual field
}

// timetable
export type ClassPopulated = {
    _id: string;
    organizer: Pick<UserPopulated, '_id' | 'fullName'> | null;
    subject: Pick<SubjectPopulated, '_id' | 'name' | 'shortName'> | null;
    classType: ClassTypePopulated;
    weekday: number;
    periodBlocks: number[];
    room: RoomPopulated;
    semester: string;
    studentGroups: number[];
}
export type ClassTypePopulated = {
    _id: string;
    name: string;
    acronym: string | null;
    color: string | null;
}
export type PeriodPopulated = {
    _id: string;
    weekdays: number[];
    order: number;
    startTime: string;
    endTime: string;
}
export type SchedulePopulated = {
    _id: string;
    weekdays: number[];
    periods: Omit<PeriodPopulated, '_id' | 'weekdays'>;
}
export type TimetablePopulated = {
    _id: string;
    semester: string;
    weekdays: number[];
    schedules: SchedulePopulated[];
    groups: {
        classType: Pick<ClassTypePopulated, 'name' | 'acronym'>;
        groupCount: number;
    };
    classes: ClassPopulated[];
}

// TODO: move/delete this type
export type ClassData = {
    classes: Array<TimetablePopulated>;
    groups: Array<ClassTypePopulated>;
    schedules: Array<SchedulePopulated>;
    semester: string;
    targetedSemester: number;
    weekdays: Array<number>;
    _id: string;
}