import React, {useEffect, useState} from "react";
import ECourseMode from "../../../../backend/src/enums/ECourseMode.ts";
import ECourseCycle from "../../../../backend/src/enums/ECourseCycle.ts";
import APIUtils from "../../utils/APIUtils.ts";
import apiService from "../../../services/apiService.tsx";
import {TimetablePopulated, UserPopulated} from "../../../services/databaseTypes.tsx";

type StudentInfo = {
    facultyId: string;
    mode: ECourseMode;
    cycle: ECourseCycle;
    courseId: string;
    semesterId: string;
}

type GroupNumberPicker = {
    acronym: string;
    number: number;
    _id: string;
}

type PrivateScheduleProps = {
    studentInfo: StudentInfo;
}

type Test = {
    [key: string]: number;
}

const PrivateSchedule:React.FC<PrivateScheduleProps> = (props: PrivateScheduleProps) => {

    const [timetables, setTimetables] = useState<Array<TimetablePopulated>>([])
    const [selectedTimetable, setSelectedTimetable] = useState<TimetablePopulated>()
    const [groupTypeCount, setGroupTypeCount] = useState<Array<GroupNumberPicker>>([])
    const [selectedGroupNumber, setSelectedGroupNumber] = useState<Test>({})
    const [users, setUsers] = useState<Array<UserPopulated>>([])


    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getUsers();

            setUsers(data);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getTimetables();

            setTimetables(data);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const timetable = timetables.filter(item => item.semester === props.studentInfo.semesterId)
        if (timetable){
            setSelectedTimetable(timetable[0])
        }
    }, [timetables]);

    // console.log(APIUtils.getSemesterClassTypes(semesters,props.studentInfo.semesterId));
    useEffect(() => {
        if (selectedTimetable){
            // console.log(APIUtils.getTimetableGroupCounts(timetables,selectedTimetable?._id))
            const counts = APIUtils.getTimetableGroupCounts(timetables,selectedTimetable?._id)
            const transformedObject = Object.entries(counts).flatMap(([key, value]) =>
                value.map(item => ({
                    acronym: item.acronym,
                    number: +key, // Convert key to a number
                    _id: item._id,
                }))
            );
            setGroupTypeCount(transformedObject)
        }
    }, [selectedTimetable]);

    const handleGroupNumberChange = (e: React.ChangeEvent<HTMLSelectElement>, id: string) => {
        console.log(e.target.value)
        const numberPicked = Number(e.target.value);  // Get the selected number

        // Update the state by setting the acronym key with the new number
        setSelectedGroupNumber((prevState) => ({
            ...prevState,
            [id]: numberPicked,  // Set new or update existing key
        }));
    };

    useEffect(() => {
        groupTypeCount.map((group) =>{
            setSelectedGroupNumber((prevState) => ({
                ...prevState,
                [group._id]: 0,  // Set new or update existing key
            }))
        })
    }, [groupTypeCount]);

    const sendData = () => {
        const isZeroed = Object.values(selectedGroupNumber).some(value => value > 0);
        if (isZeroed){
            const groupToPush = Object.entries(selectedGroupNumber).map(([key, value]) => ({
                _id: key,
                number: value,
            }));
            console.log(selectedGroupNumber)
            console.log(APIUtils.getStudentClasses(timetables, users, props.studentInfo.semesterId, groupToPush))
        }else {
            console.error("Wybierz przynajmniej jedną grupę!")
        }
    }

    // console.log(selectedGroupNumber)

    return (
        <div className="text-center">
            <div className="d-flex">
                {
                    groupTypeCount.map((value, index) =>
                        <div key={index} className="w-25 m-3">
                            Grupa {value.acronym}:
                            <select
                                className="form-select"
                                aria-label="Default select example"
                                value={selectedGroupNumber[value._id] || ""}  // Use the first object in the array (adjust if needed)
                                onChange={(e) => handleGroupNumberChange(e, value._id)}
                            >
                                <option value="0">Wybierz...</option>
                                {/*<option value="0">Żadna</option>*/}
                                {
                                    Array.from({length: value.number}, (_, i) => (
                                        <option key={i} value={i + 1}>
                                            {`${value.acronym} ${i + 1}`}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                    )
                }
            </div>
            <button className="btn btn-primary" onClick={sendData}>Zatwierdź</button>
            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <td>

                        </td>
                    </tr>
                    </thead>
                </table>
            </div>
        </div>
    );
};

export default PrivateSchedule;