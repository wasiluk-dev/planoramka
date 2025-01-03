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
            return [];
        }

        return await response.json();
    }

    // courses
    static async getCourses(): Promise<CoursePopulated[]> {
        return this.fetchAPIResponse('/courses');
    }
    static async getElectiveSubjects(): Promise<ElectiveSubjectPopulated[]> {
        return this.fetchAPIResponse('/elective-subjects');
    }
    static async getSemesters(): Promise<SemesterPopulated[]> {
        return this.fetchAPIResponse('/semesters');
    }
    static async getSubjects(): Promise<SubjectPopulated[]> {
        return this.fetchAPIResponse('/subjects');
    }
    static async getSubjectDetails(): Promise<SubjectDetailsPopulated[]> {
        return this.fetchAPIResponse('/subject-details');
    }

    // faculty
    static async getBuildings(): Promise<BuildingPopulated[]> {
        return this.fetchAPIResponse('/buildings');
    }
    static async getFaculties(): Promise<FacultyPopulated[]> {
        return this.fetchAPIResponse('/faculties');
    }
    static async getRooms(): Promise<RoomPopulated[]> {
        return this.fetchAPIResponse('/rooms');
    }

    // timetable
    static async getClasses(): Promise<ClassPopulated[]> {
        return this.fetchAPIResponse('/classes');
    }
    static async getClassTypes(): Promise<ClassTypePopulated[]> {
        return this.fetchAPIResponse('/class-types');
    }
    static async getPeriods(): Promise<PeriodPopulated[]> {
        return this.fetchAPIResponse('/periods');
    }
    static async getSchedules(): Promise<SchedulePopulated[]> {
        return this.fetchAPIResponse('/schedules');
    }
    static async getTimetables(): Promise<TimetablePopulated[]> {
        return this.fetchAPIResponse('/timetables');
    }

    // user
    static async getUsers(): Promise<UserPopulated[]> {
        return this.fetchAPIResponse('/users');
    }
    static async registerUser(registerData: Pick<Omit<UserPopulated, 'password'> & { password: string }, 'username' | 'password' | 'names' | 'surnames'>) {
        const body = new URLSearchParams();
        body.append('username', registerData.username);
        body.append('password', registerData.password);
        body.append('names', registerData.names);
        body.append('surnames', registerData.surnames);

        try {
            const response: Response = await fetch(dbUrl + '/auth/register', {
                method: 'POST',
                headers: headers,
                body: body,
            });

            if (!response.ok) {
                console.error(response.statusText);
            }

            return response;
        } catch (err) {
            console.error(err);
        }
    }
    static async loginUser(loginData: Pick<Omit<UserPopulated, 'password'> & { password: string }, 'username' | 'password'>) {
        const body = new URLSearchParams();
        body.append('username', loginData.username);
        body.append('password', loginData.password);

        try {
            const response: Response = await fetch(dbUrl + '/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: headers,
                body: body,
            });

            if (!response.ok) {
                console.error(response.statusText);
            } else {
                return response.json();
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
    static async isUserLoggedIn() {
        try {
            const response: Response = await fetch(dbUrl + '/auth/session', {
                method: 'GET',
                headers: headers,
            });

            return response.ok;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}
