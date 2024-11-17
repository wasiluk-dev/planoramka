import * as dataType from "./databaseTypes.tsx";

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
    name: string;
    fullname: string;
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
        urlencoded.append("name", registerdata.name);
        urlencoded.append("fullname", registerdata.fullname);
        urlencoded.append("password", registerdata.password);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: urlencoded,
        };
        //CZEMU TO TERAZ DZIAŁA
        console.log(urlencoded)
        await fetch( baseUrl + "/users", requestOptions)
            .then((response) => {
                console.log(response)
                response.text()
            })
            // .then((result) => {
            //     console.log(result)
            // })
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

    }
}
export default  apiService;