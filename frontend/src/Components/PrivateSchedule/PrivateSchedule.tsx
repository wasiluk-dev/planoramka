import React, {useEffect, useState} from "react";
import ECourseMode from "../../../../backend/src/enums/ECourseMode.ts";
import ECourseCycle from "../../../../backend/src/enums/ECourseCycle.ts";
import APIUtils from "../../utils/APIUtils.ts";
import apiService from "../../../services/apiService.tsx";
import {TimetablePopulated} from "../../../services/databaseTypes.tsx";
import EWeekday from "../../enums/EWeekday.ts";
import PeriodBlock from "../PeriodBlock/PeriodBlock.tsx";

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
    const [orderedWeekdays, setOrderedWeekdays] = useState<string[]>([]);
    const [subjectList, setSubjectList] = useState<Record<EWeekday, Record<number, {}[]>>>()


    useEffect(() => {
        const reorderWeekdays = () => {
            const weekdays = Object.keys(EWeekday).filter(
                (key) => isNaN(Number(key)) // Exclude numeric keys
            );
            // Move Sunday to the end
            return [...weekdays.filter((day) => day !== "Sunday"), "Sunday"];
        };

        setOrderedWeekdays(reorderWeekdays());
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
            console.log(APIUtils.getStudentClasses(timetables,props.studentInfo.semesterId, groupToPush))
            setSubjectList(APIUtils.getStudentClasses(timetables,props.studentInfo.semesterId, groupToPush))
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
            <div className="table-container mt-3">
                <table className="table table-dark table-bordered table-striped">
                    <thead>
                    <tr>
                        {orderedWeekdays.map((day) => (
                            <th className="" key={day}>{day}</th>
                        ))}
                    </tr>
                    <tr>
                        {subjectList
                            ? (() => {
                                // Convert the object into entries
                                const entries = Object.entries(subjectList);

                                // Separate the entry for weekday 0
                                const weekday0 = entries.find(([key]) => key === "0");
                                const otherEntries = entries.filter(([key]) => key !== "0");

                                // Append weekday 0 to the end
                                const orderedEntries = [...otherEntries, ...(weekday0 ? [weekday0] : [])];

                                // Render the ordered entries
                                return orderedEntries.map(([weekday, lessons]) => (
                                    <td key={weekday} className="col-1">
                                        {Object.entries(lessons).map(([lesson, entries]) => (
                                            <div key={lesson} className="mt-1">
                                                {entries.map((entry, index) => (
                                                    <PeriodBlock
                                                        key={index}
                                                        organizer={entry.organizer}
                                                        classType={entry.classType}
                                                        subject={entry.subject}
                                                        room={entry.room}
                                                    />
                                                ))}
                                            </div>
                                        ))}
                                    </td>
                                ));
                            })()
                            : "No data available"}
                    </tr>
                    </thead>
                </table>
            </div>
        </div>
    );
};

export default PrivateSchedule;