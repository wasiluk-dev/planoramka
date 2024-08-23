const baseUrl :String = 'http://localhost:3000';
const  myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

type User = {
    username: string;
    password: string;
    email: string;
    name?: string;
    surname?: string;
    type?: number;
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

    createUser: async (registerdata: CreateUser): Promise<void> => {

        const dane : User = {
            username:registerdata.username,
            password:registerdata.password,
            email:"email@gmail.com",
            name:"name",
            surname:"Surname"
        }
        const urlencoded = new URLSearchParams();
        urlencoded.append("username", dane.username);
        urlencoded.append("password", dane.password);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: urlencoded,
        };
        //CZEMU TO TERAZ DZIAŁA
        fetch("http://localhost:3000/users", requestOptions)
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