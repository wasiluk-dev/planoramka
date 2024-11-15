import * as dataType from "./databaseTypes.tsx";
import {redirect} from "react-router-dom";

const baseUrl :string = 'https://127.0.0.1:3000';
const  myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

//old type, will not be used, to be deleted
type User = {
    username: string;
    password: string;
    email: string;
    name?: string;
    surname?: string;
    type?: number;
}

type CreateUser = {
    username: string;
    fullname: string;
    password: string;
}

type LoginUser = {
    username: string;
    password: string;
}

const apiService = {
    //Test Api - userzy
    getTestPerson: async (): Promise<User | null> => {
        const response : Response = await fetch(baseUrl + '/users');
        if (!response.ok) {
            return null;
        }

        return await response.json();
    },

    getPeriods: async (): Promise<dataType.Periods | null> => {
        const response : Response = await fetch(baseUrl + '/periods');
        if (!response.ok) {
            return null;
        }
        return await response.json();
    },
    // getSemesters: async (): Promise<Courses | null> => {
    //     const response : Response = await fetch(baseUrl + '/semesters');
    //     if (!response.ok) {
    //         return null;
    //     }
    //     return await response.json();
    // },
    // getElecviteSubjects: async (): Promise<Courses | null> => {
    //     const response : Response = await fetch(baseUrl + '/electiveSubjects');
    //     if (!response.ok) {
    //         return null;
    //     }
    //     return await response.json();
    // },

    getTimeTables: async (): Promise<dataType.TimeTables | null> => {
        const response : Response = await fetch(baseUrl + '/timeTables');
        if (!response.ok) {
            return null;
        }
        return await response.json();
    },
    getSubjectDetails: async (): Promise<Object | null> => {
        const response : Response = await fetch(baseUrl + '/subject-details');
        if (!response.ok) {
            return null;
        }
        return await response.json();
    },


    createUser: async (registerdata: CreateUser): Promise<void> => {

        const urlencoded = new URLSearchParams();
        urlencoded.append("username", registerdata.username);
        urlencoded.append("fullName", registerdata.fullname);
        urlencoded.append("password", registerdata.password);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: urlencoded,
        };
        //CZEMU TO TERAZ DZIAŁA
        await fetch( baseUrl + "/auth/register", requestOptions)
            .then((response) => {
                console.log(response)
                response.text()
            })
            .catch((error) => {
                console.log(error)
            });

        // const response = await fetch(baseUrl + '/users', {
        //     method: 'POST',
        //     headers: myHeaders,
        //     body: formBody,
        //     redirect: 'follow'
        // });
        //
        // if (!response.ok) {
        //     //NIE UDAŁO SIĘ UTWORZYĆ KONTA
        //     console.error('Failed to create user:', await response.text());
        //     return false;
        // }else{
        //     //UŻYTKOWNIK POPRAWNIE UTWORZYŁ KONTO
        //     return true;
        // }

    },

    loginUser: async (registerdata: LoginUser): Promise<void> => {

        const urlencoded = new URLSearchParams();
        urlencoded.append("username", registerdata.username);
        urlencoded.append("password", registerdata.password);

        const requestOptions = {
            method: "POST",
            credentials: "include",
            headers: myHeaders,
            body: urlencoded
        };
        //CZEMU TO TERAZ DZIAŁA
        try {
            const response = await fetch(baseUrl + "/auth/login", requestOptions);

            if (response.ok) {
                console.log("Login successful");
                // Display cookies
                console.log("Cookies after login:", document.cookie);
            } else {
                console.error("Login failed:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Request error:", error);
        }
    },

    logoutUser: async (): Promise<void> => {

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
        };
        //CZEMU TO TERAZ DZIAŁA
        try {
            const response = await fetch(baseUrl + "/auth/logout", requestOptions);

            if (response.ok) {
                console.log("Logout successful");

            } else {
                console.error("Logout failed:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Request error:", error);
        }
    }
}
export default  apiService;