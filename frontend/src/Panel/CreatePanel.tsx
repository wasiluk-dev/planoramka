import React, {useEffect, useState} from "react";
import apiService from "../../services/apiService.tsx";

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
    classType: Array<string>;
    organizer: Array<string | Array<string>>;
    periods: string | null;
    room: Array<string>;
    studentGroups: Array<number>;
    subject: Array<string>;


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

const CreatePanel: React.FC = () => {
    const [timeTables, setTimeTables] = useState<TimeTables[] | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getTimeTables()
            setTimeTables(data); // Store fetched time tables in state
        };

        fetchData();
    }, []);


    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    Dodaj Course:
                </div>
                <div className="col">
                    Dodaj Coś innego:
                </div>
                <div className="col">
                    Dodaj Jeszcze coś innego:
                </div>
                <div className="col">
                    Dodaj Tamto:
                </div>
                <div className="col">
                    Dodaj Siamto:
                </div>
            </div>
        </div>
    );
};

export default CreatePanel;
