import {
    CoursePopulated,
    ElectiveSubjectPopulated,
    SemesterPopulated,
    SubjectDetailsPopulated,
    SubjectPopulated,

    BuildingPopulated,
    FacultyPopulated,
    RoomPopulated,

    ClassPopulated,
    ClassTypePopulated,
    PeriodPopulated,
    SchedulePopulated,
    TimetablePopulated,
} from './DBTypes.ts';
import CourseRoutes from '../../backend/src/routes/courses/CourseRoutes.ts';
import ElectiveSubjectRoutes from '../../backend/src/routes/courses/ElectiveSubjectRoutes.ts';
import SemesterRoutes from '../../backend/src/routes/courses/SemesterRoutes.ts';
import SubjectRoutes from '../../backend/src/routes/courses/SubjectRoutes.ts';
import SubjectDetailsRoutes from '../../backend/src/routes/courses/SubjectDetailsRoutes.ts';

import BuildingRoutes from '../../backend/src/routes/faculty/BuildingRoutes.ts';
import FacultyRoutes from '../../backend/src/routes/faculty/FacultyRoutes.ts';
import RoomRoutes from '../../backend/src/routes/faculty/RoomRoutes.ts';

import ClassRoutes from '../../backend/src/routes/timetable/ClassRoutes.ts';
import ClassTypeRoutes from '../../backend/src/routes/timetable/ClassTypeRoutes.ts';
import PeriodRoutes from '../../backend/src/routes/timetable/PeriodRoutes.ts';
import ScheduleRoutes from '../../backend/src/routes/timetable/ScheduleRoutes.ts';
import TimetableRoutes from '../../backend/src/routes/timetable/TimetableRoutes.ts';

// TODO: replace url with .env variable
const dbUrl: string = 'https://127.0.0.1:3000';
type UserRegistrationForm = {
    username: string;
    password: string;
    fullName: string;
}

export default class APIService {
    private static async fetchAPIResponse(resourceName: string) {
        const response: Response = await fetch(dbUrl + resourceName);
        if (!response.ok) {
            return null;
        }

        return await response.json();
    }

    // courses
    static async getCourses(): Promise<CoursePopulated | null> {
        return this.fetchAPIResponse(new CourseRoutes().prefix);
    }
    static async getElectiveSubjects(): Promise<ElectiveSubjectPopulated | null> {
        return this.fetchAPIResponse(new ElectiveSubjectRoutes().prefix);
    }
    static async getSemesters(): Promise<SemesterPopulated | null> {
        return this.fetchAPIResponse(new SemesterRoutes().prefix);
    }
    static async getSubjects(): Promise<SubjectPopulated | null> {
        return this.fetchAPIResponse(new SubjectRoutes().prefix);
    }
    static async getSubjectDetails(): Promise<SubjectDetailsPopulated | null> {
        return this.fetchAPIResponse(new SubjectDetailsRoutes().prefix);
    }

    // faculty
    static async getBuildings(): Promise<BuildingPopulated | null> {
        return this.fetchAPIResponse(new BuildingRoutes().prefix);
    }
    static async getFaculties(): Promise<FacultyPopulated | null> {
        return this.fetchAPIResponse(new FacultyRoutes().prefix);
    }
    static async getRooms(): Promise<RoomPopulated | null> {
        return this.fetchAPIResponse(new RoomRoutes().prefix);
    }

    // timetable
    static async getClasses(): Promise<ClassPopulated | null> {
        return this.fetchAPIResponse(new ClassRoutes().prefix);
    }
    static async getClassTypes(): Promise<ClassTypePopulated | null> {
        return this.fetchAPIResponse(new ClassTypeRoutes().prefix);
    }
    static async getPeriods(): Promise<PeriodPopulated | null> {
        return this.fetchAPIResponse(new PeriodRoutes().prefix);
    }
    static async getSchedules(): Promise<SchedulePopulated | null> {
        return this.fetchAPIResponse(new ScheduleRoutes().prefix);
    }
    static async getTimetables(): Promise<TimetablePopulated | null> {
        return this.fetchAPIResponse(new TimetableRoutes().prefix);
    }

    static async createUser(registerData: UserRegistrationForm) {
        const body = new URLSearchParams();
        body.append("username", registerData.username);
        body.append("password", registerData.password);
        body.append("fullName", registerData.fullName);

        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        const requestOptions = {
            method: "POST",
            headers: headers,
            body: body,
        };

        await fetch(dbUrl + "/users", requestOptions)
            .then((response: Response): void => {
                response.text();
            })
            .catch((err) => {
                console.error(err);
            });
    }
}
