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
    title: string | null;
    courses: string[];
    role: EUserRole;
    fullName: string;
    fullNameReversed: string;
    fullNameWithTitle: string;
}

// courses
export type CoursePopulated = {
    _id: string;
    code: string;
    name: string;
    specialization: string | null;
    degree: ECourseDegree | null;
    cycle: ECourseCycle;
    mode: ECourseMode;
    semesters: SemesterPopulated[];
    electiveSubjects: ElectiveSubjectPopulated[];
}
export type ElectiveSubjectPopulated = {
    _id: string;
    name: string;
    subjects: SubjectPopulated[];
}
export type SemesterPopulated = {
    _id: string;
    academicYear: string;
    index: number;
    subjects: Pick<SubjectPopulated, '_id' | 'code' | 'name' | 'classTypes'>[];
}
export type SubjectPopulated = {
    _id: string;
    code: string;
    name: string;
    acronym: string | null;
    isElective: boolean;
    classTypes: ClassTypePopulated[];
}
export type SubjectDetailsPopulated = {
    _id: string;
    course: Pick<CoursePopulated, '_id' | 'code' | 'name' | 'specialization'>;
    subject: Omit<SubjectPopulated, 'classTypes'>;
    details: {
        classType: ClassTypePopulated;
        weeklyBlockCount: number;
    }[];
}

// faculty
export type BuildingPopulated = {
    _id: string;
    name: string;
    acronym: string | null;
    address: string | null;
    rooms: RoomPopulated[];
}
export type FacultyPopulated = {
    _id: string;
    name: string;
    acronym: string;
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
    organizer: Pick<UserPopulated, '_id' | 'title' | 'names' | 'surnames' | 'fullNameReversed'> | null;
    subject: Pick<SubjectPopulated, '_id' | 'code' | 'name' | 'acronym'> | null;
    classType: ClassTypePopulated;
    weekday: number;
    periodBlocks: number[];
    room: RoomPopulated;
    semester: SemesterPopulated | null;
    studentGroups: number[];
}
export type ClassUnpopulated = {
    _id: string;
    organizer: string | null;
    subject: string | null;
    classType: string;
    weekday: number;
    periodBlocks: number[];
    room: string;
    semester: string | null;
    studentGroups: number[];
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
    periods: Omit<PeriodPopulated, 'weekdays'>[];
    active: boolean;
}
export type TimetablePopulated = {
    _id: string;
    semester: string;
    weekdays: EDayOfTheWeek[];
    schedules: SchedulePopulated[];
    groups: {
        classType: ClassTypePopulated;
        groupCount: number;
    }[];
    classes: ClassPopulated[];
}
