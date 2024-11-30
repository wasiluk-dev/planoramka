import {
    BuildingPopulated,
    ClassPopulated,
    ClassTypePopulated,
    CoursePopulated,
    ElectiveSubjectPopulated,
    FacultyPopulated,
    PeriodPopulated,
    RoomPopulated,
    SchedulePopulated,
    SemesterPopulated,
    SubjectDetailsPopulated,
    SubjectPopulated,
    TimetablePopulated,
    UserPopulated,
} from './databaseTypes.tsx';

// TODO: replace url with .env variable
const dbUrl: string = 'https://127.0.0.1:3000';
const headers = new Headers();
headers.append('Content-Type', 'application/x-www-form-urlencoded');

export default class APIService {
    private static async fetchAPIResponse(resourceName: string) {
        const response: Response = await fetch(dbUrl + resourceName);

        if (!response.ok) {
            // TODO?: replace with a throw?
            return null;
        }

        return await response.json();
    }

    // courses
    static async getCourses(): Promise<CoursePopulated[] | null> {
        return this.fetchAPIResponse('/courses');
    }
    static async getElectiveSubjects(): Promise<ElectiveSubjectPopulated[] | null> {
        return this.fetchAPIResponse('/elective-subjects');
    }
    static async getSemesters(): Promise<SemesterPopulated[] | null> {
        return this.fetchAPIResponse('/semesters');
    }
    static async getSubjects(): Promise<SubjectPopulated[] | null> {
        return this.fetchAPIResponse('/subjects');
    }
    static async getSubjectDetails(): Promise<SubjectDetailsPopulated[] | null> {
        return this.fetchAPIResponse('/subject-details');
    }

    // faculty
    static async getBuildings(): Promise<BuildingPopulated[] | null> {
        return this.fetchAPIResponse('/buildings');
    }
    static async getFaculties(): Promise<FacultyPopulated[] | null> {
        return this.fetchAPIResponse('/faculties');
    }
    static async getRooms(): Promise<RoomPopulated[] | null> {
        return this.fetchAPIResponse('/rooms');
    }

    // timetable
    static async getClasses(): Promise<ClassPopulated[] | null> {
        return this.fetchAPIResponse('/classes');
    }
    static async getClassTypes(): Promise<ClassTypePopulated[] | null> {
        return this.fetchAPIResponse('/class-types');
    }
    static async getPeriods(): Promise<PeriodPopulated[] | null> {
        return this.fetchAPIResponse('/periods');
    }
    static async getSchedules(): Promise<SchedulePopulated[] | null> {
        return this.fetchAPIResponse('/schedules');
    }
    static async getTimetables(): Promise<TimetablePopulated[] | null> {
        return this.fetchAPIResponse('/timetables');
    }

    static async getUsers(): Promise<UserPopulated | null> {
        return this.fetchAPIResponse('/users');
    }
    static async registerUser(registerData: Pick<UserPopulated, 'username' | 'password' | 'fullName'>) {
        const body = new URLSearchParams();
        body.append('username', registerData.username);
        body.append('password', registerData.password);
        body.append('fullName', registerData.fullName);

        try {
            const response: Response = await fetch(dbUrl + '/auth/register', {
                method: 'POST',
                headers: headers,
                body: body,
            });

            if (!response.ok) {
                console.error(response.statusText);
            }
        } catch (err) {
            console.error(err);
        }
    }
    static async loginUser(registerData: Pick<UserPopulated, 'username' | 'password'>) {
        const body = new URLSearchParams();
        body.append('username', registerData.username);
        body.append('password', registerData.password);

        try {
            const response: Response = await fetch(dbUrl + '/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: headers,
                body: body,
            });

            if (!response.ok) {
                console.error(response.statusText);
            }
        } catch (err) {
            console.error(err);
        }
    }
    static async logoutUser() {
        try {
            const response: Response = await fetch(dbUrl + '/auth/logout', {
                method: 'POST',
                headers: headers,
            });

            if (response.ok) {
                document.cookie = 'connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            } else {
                console.error('Logout failed:', response.status, response.statusText);
            }
        } catch (err) {
            console.error(err);
        }
    }
}
