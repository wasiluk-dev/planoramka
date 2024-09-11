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

type Users ={
    _id: string;
    username: string;
    password: string;
    name: string;
    surname: string;
    title: string;
    email: string;
    courses: Array<string>; // id of courses
    role: number;
}

type ClassTypes ={
    _id: string;
    name: string;
    acronym: string;
    color: string;
}

type Subjects ={
    _id: string;
    name: string;
    code: string;
    shortName: string;
    isElective: boolean;
    targetedSemessters: Array<number>;
    sclassTypes: Array<string>; //odniesienie do rodzaju przedmiotu
}

type Semesters ={
    _id: string;
    courseCode: string;
    number: number;
    subjectCount: number;
    subjects: Array<string>; //odniesienie do ID przedmiotów
}

type ElectiveSubjects ={
    _id: string;
    courseCode: string;
    name: string;
    subjects: Array<string>; //odniesienie do ID przedmiotów
}

type Courses ={
    _id: string;
    code: string;
    name: string;
    specialization: string;
    cycle: number;
    degree: number;
    mode: boolean;
    startDate: string;
    sesmesterCount: number;
    semesters: Array<string>; //odniesienie do ID danyuch semestrów
    electiveSubjects: Array<string>; //odniesienie do przedmiotów obieralnych w semetrze
}

type Periods ={
    _id: string;
    weekdays: Array<number>;
    startTime: string;
    endTime: string;
    isBreak: boolean;
}

type RoomTypes ={
    _id: string;
    name: string;
    color: string;
}

type TimeTables ={
    //TODO: check this shit sometimes
    _id: string;
    semester: string; //odniesienie do semestru (WOW)
    targetedsemester: number;
    classes: Array<string>; //odniesienie do przdmiotów
}

type Classes ={
    _id: string;
    organizer: string; //odniesienie do ID usera/nauczyciela
    subject: string; //odniesienie do ID Przedmiotu
    classType: string; // odniesienie do ID typu zajęć
    studentGroups: Array<number>;
    room: string; // odniesienie do ID pokoju
    periods: Array<string>; //odniesienie do ID Semestrów
}

type Rooms ={
    _id: string;
    number: string;
    numberSecondary: string;
    capacity: number;
}

type Buildings = {
    _id: string;
    facultyAcronym: string;
    acronym: string;
    name: string;
    addres: string;
    rooms: Array<string>; //odniesienie do ID pokoju
}

type Faculties = {
    _id: string;
    acronym: string;
    name: string;
    courses: Array<string>; //odniesienie do ID Kursu
    buildings: Array<string>; //odniesienie do id budynków
}



const apiService = {
    //Test Api - userzy
    getTestPerson: async (): Promise<User | null> => {
        const response : Response = await fetch(baseUrl + '/periods');
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