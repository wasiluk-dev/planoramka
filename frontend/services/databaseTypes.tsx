import ECourseCycle from '../../backend/src/enums/ECourseCycle';
import ECourseDegree from '../../backend/src/enums/ECourseDegree';
import ECourseMode from '../../backend/src/enums/ECourseMode.ts';
import EUserRole from '../../backend/src/enums/EUserRole.ts';
import EDayOfTheWeek from '../../backend/src/enums/EDayOfTheWeek.ts';

export type UserPopulated = {
    _id: string;
    username: string;
    password: string | null;
    names: string;
    surnames: string;
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
    degree: ECourseDegree | null; // TODO: remove null?
    cycle: ECourseCycle;
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
        classType: ClassTypePopulated;
        weeklyBlockCount: number;
    }];
}

// faculty
export type BuildingPopulated = {
    _id: string;
    name: string;
    acronym: string | null;
    address: string;
    // hasDeanOffice: boolean;
    // hasRectorOffice: boolean;
    rooms: RoomPopulated[];
}
export type FacultyPopulated = {
    _id: string;
    name: string;
    acronym: string | null;
    buildings: Omit<BuildingPopulated, 'address'>[];
    courses: Pick<CoursePopulated, '_id' | 'code' | 'name' | 'specialization' | 'semesters'>[];
}
export type RoomPopulated = {
    _id: string;
    number: string;
    numberSecondary: string | null;
    capacity: number | null;
    roomNumber: string; // virtual field (number / numberSecondary / number + numberSecondary)
}

// timetable
export type ClassPopulated = {
    _id: string;
    organizer: Pick<UserPopulated, '_id' | 'names' | 'surnames'> | null;
    subject: Pick<SubjectPopulated, '_id' | 'name' | 'shortName'> | null;
    classType: ClassTypePopulated;
    weekday: number;
    periodBlocks: number[];
    room: RoomPopulated;
    semester: string | null;
    studentGroups: number[] | null;
}
export type ClassTypePopulated = {
    _id: string;
    name: string;
    acronym: string;
    color: string | null;
}
export type PeriodPopulated = {
    _id: string;
    weekdays: EDayOfTheWeek[];
    order: number;
    startTime: string;
    endTime: string;
}
export type SchedulePopulated = {
    _id: string;
    weekdays: EDayOfTheWeek[];
    periods: Omit<PeriodPopulated, '_id' | 'weekdays'>[];
}
export type TimetablePopulated = {
    _id: string;
    semester: string;
    weekdays: EDayOfTheWeek[];
    schedules: SchedulePopulated[];
    groups: {
        classType: Omit<ClassTypePopulated, 'color'>;
        groupCount: number;
    }[] | null;
    classes: ClassPopulated[];
}
