// noinspection JSUnusedGlobalSymbols

import {
    BuildingPopulated,
    ClassPopulated,
    ClassTypePopulated,
    ClassUnpopulated,
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
} from './DBTypes.ts';

// TODO: replace url with .env variable
const dbUrl: string = `https://127.0.0.1:3000`;
const headers = new Headers();
headers.append('Content-Type', 'application/x-www-form-urlencoded');

export default class APIService {
    private static async getDBResources(resourceName: string) {
        const response: Response = await fetch(dbUrl + resourceName);

        if (!response.ok) {
            // TODO?: replace with a throw?
            return [];
        }

        return await response.json();
    }
    private static async postDBResources(resourceName: string, formData: URLSearchParams) {
        try {
            const response: Response = await fetch(dbUrl + resourceName, {
                method: 'POST',
                headers: headers,
                body: formData.toString(),
            });

            if (!response.ok) {
                // TODO?: replace with a throw?
                console.error(response.clone().json());
                return undefined;
            }

            return response;
        } catch (err) {
            console.error(err);
            return undefined;
        }
    }
    private static async patchDBResources(resourceName: string, formData: URLSearchParams) {
        try {
            const response: Response = await fetch(dbUrl + resourceName, {
                method: 'PATCH',
                headers: headers,
                body: formData.toString(),
            });

            if (!response.ok) {
                // TODO?: replace with a throw?
                console.error(response.clone().json());
                return undefined;
            }

            return response;
        } catch (err) {
            console.error(err);
            return undefined;
        }
    }

    // courses
    static async getCourses(): Promise<CoursePopulated[]> {
        return this.getDBResources('/courses');
    }
    static async getElectiveSubjects(): Promise<ElectiveSubjectPopulated[]> {
        return this.getDBResources('/elective-subjects');
    }
    static async getSemesters(): Promise<SemesterPopulated[]> {
        return this.getDBResources('/semesters');
    }
    static async getSubjects(): Promise<SubjectPopulated[]> {
        return this.getDBResources('/subjects');
    }
    static async getSubjectDetails(): Promise<SubjectDetailsPopulated[]> {
        return this.getDBResources('/subject-details');
    }
    static async saveCourses(formData: URLSearchParams) {
        return this.postDBResources('/courses', formData);
    }
    static async saveElectiveSubjects(formData: URLSearchParams) {
        return this.postDBResources('/elective-subjects', formData);
    }
    static async saveSemesters(formData: URLSearchParams) {
        return this.postDBResources('/semesters', formData);
    }
    static async saveSubjects(formData: URLSearchParams) {
        return this.postDBResources('/subjects', formData);
    }
    static async saveSubjectDetails(formData: URLSearchParams) {
        return this.postDBResources('/subject-details', formData);
    }

    // faculty
    static async getBuildings(): Promise<BuildingPopulated[]> {
        return this.getDBResources('/buildings');
    }
    static async getFaculties(): Promise<FacultyPopulated[]> {
        return this.getDBResources('/faculties');
    }
    static async getRooms(): Promise<RoomPopulated[]> {
        return this.getDBResources('/rooms');
    }
    static async saveBuildings(formData: URLSearchParams) {
        return this.postDBResources('/buildings', formData);
    }
    static async saveFaculties(formData: URLSearchParams) {
        return this.postDBResources('/faculties', formData);
    }
    static async saveRooms(formData: URLSearchParams) {
        return this.postDBResources('/rooms', formData);
    }

    // timetable
    static async getClasses(): Promise<ClassPopulated[]> {
        return this.getDBResources('/classes');
    }
    static async getClassTypes(): Promise<ClassTypePopulated[]> {
        return this.getDBResources('/class-types');
    }
    static async getPeriods(): Promise<PeriodPopulated[]> {
        return this.getDBResources('/periods');
    }
    static async getSchedules(): Promise<SchedulePopulated[]> {
        return this.getDBResources('/schedules');
    }
    static async getTimetables(): Promise<TimetablePopulated[]> {
        return this.getDBResources('/timetables');
    }
    static async saveClasses(formData: URLSearchParams) {
        return this.postDBResources('/classes', formData);
    }
    static async saveClassTypes(formData: URLSearchParams) {
        return this.postDBResources('/class-types', formData);
    }
    static async savePeriods(formData: URLSearchParams) {
        return this.postDBResources('/periods', formData);
    }
    static async saveSchedules(formData: URLSearchParams) {
        return this.postDBResources('/schedules', formData);
    }
    static async saveTimetables(formData: URLSearchParams) {
        return this.postDBResources('/timetables', formData);
    }
    static async updateClassesById(classes: ClassUnpopulated[]) {
        for (const c of classes) {
            const classData = await this.getClasses();
            const dbClass = classData.find(dbClass => dbClass._id === c._id)

            if (dbClass) {
                const updatedData = (({ _id, ...object }) => object)(c);

                const formData = new URLSearchParams();
                formData.append('filter', JSON.stringify({ _id: c._id }));
                formData.append('update', JSON.stringify(updatedData));

                this.patchDBResources('/classes', formData).then(response => {
                    console.log('response', response);
                });
            }
        }

        return true;
    }

    // user
    static async getUsers(): Promise<UserPopulated[]> {
        return this.getDBResources('/users');
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

            const json = await response.json();
            if (!response.ok) {
                throw json;
            }

            return json;
        } catch (err) {
            throw err;
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
    static async updateUserById(userId: string, updatedData: Partial<UserPopulated>) {
        const formData = new URLSearchParams();
        formData.append('filter', JSON.stringify({ _id: userId }));
        formData.append('update', JSON.stringify(updatedData));

        return this.patchDBResources('/users', formData);
    }
    static async getLoggedInUser() {
        try {
            const response: Response = await fetch(dbUrl + '/auth/session', {
                method: 'GET',
                headers: headers,
                credentials: 'include',
            });

            const json = await response.json();
            if (!response.ok) {
                return undefined;
            }

            return json;
        } catch (err) {
            return undefined;
        }
    }
}
