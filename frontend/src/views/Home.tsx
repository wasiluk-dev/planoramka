import React, {useEffect, useState} from 'react';

import ENavTabs from '../enums/ENavTabs';
import i18n, { i18nPromise } from '../i18n';
import SearchableDropdown from "../Components/SearchableDropdown/SearchableDropdown.tsx";
import apiService from "../../services/apiService.tsx";
import APIUtils from "../utils/APIUtils.ts";
import EUserRole from "../../../backend/src/enums/EUserRole.ts";
import {ClassPopulated, FacultyPopulated, TimetablePopulated, UserPopulated} from "../../services/databaseTypes.tsx";
import AvailableTable from "../Components/AvailableTable/AvailableTable.tsx";
import PrivateScheduleOptions from "../Components/PrivateSchedule/PrivateScheduleOptions.tsx";
import ECourseMode from "../../../backend/src/enums/ECourseMode.ts";
import ECourseCycle from "../../../backend/src/enums/ECourseCycle.ts";
import PrivateSchedule from "../Components/PrivateSchedule/PrivateSchedule.tsx";
import {Button} from "@mui/material";

const { t } = i18n;
await i18nPromise;

type HomeProps = {
    setDocumentTitle: React.Dispatch<React.SetStateAction<string>>;
    setCurrentTabValue: React.Dispatch<React.SetStateAction<number | boolean>>;
}

type StudentInfo = {
    facultyId: string;
    mode: ECourseMode;
    cycle: ECourseCycle;
    courseId: string;
    semesterId: string;
}

const Home: React.FC<HomeProps> = ({ setDocumentTitle, setCurrentTabValue }) => {

    const [childMessage, setChildMessage] = useState<StudentInfo>({
        facultyId: "",
        mode: 0,
        cycle: 0,
        courseId: "",
        semesterId: "",
    })
    const [childMessageToSend, setChildMessageToSend] = useState<StudentInfo>({
        facultyId: "",
        mode: 0,
        cycle: 0,
        courseId: "",
        semesterId: "",
    })

    useEffect(() => {
        setChildMessageToSend(childMessage)
    }, [childMessage]);

    const handleChildData = (data: StudentInfo) => {
        setChildMessage(data);
    };

    const handleRefresh = () => {
        // Update the key to trigger re-render
        setRefreshKey(prevKey => prevKey + 1);
    };

    const [classes, setClasses] = useState<Array<ClassPopulated>>([])
    const [faculties, setFaculties] = useState<Array<FacultyPopulated>>([])
    const [timetables, setTimetables] = useState<Array<TimetablePopulated>>([])
    const [refreshKey, setRefreshKey] = useState<number>(0); // State for forcing re-render
    const [selectedScheduleType, setSelectedScheduleType] = useState<string>("")
    const [teacherList, setTeacherList] = useState([])
    const [allTeachers, setAllTeachers] = useState<Array<UserPopulated>>([])
    const [selectedTeacherId, setSelectedTeacherId] = useState<string>("")
    const [selectedTeacher, setSelectedTeacher] = useState<string>("")
    const [teacherSurnameList, setTeacherSurnameList] = useState<Pick<UserPopulated, '_id' | 'surnames' | 'names'>[]>([])
    const [studentInfo, setStudentInfo] = useState<StudentInfo>()

    useEffect(() => {
        setDocumentTitle(t('nav_route_main'));
        setCurrentTabValue(ENavTabs.Home);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getUsers();

            setAllTeachers(APIUtils.getUsersWithRole(data, EUserRole.Professor));
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const dataTables = await apiService.getTimetables();
            const dataClasses = await apiService.getClasses();
            const dataFaculties = await apiService.getFaculties();

            setTimetables(dataTables);
            setClasses(dataClasses);
            setFaculties(dataFaculties);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const modifiedNames = allTeachers.map(teacher => {
            const surnames = teacher.surnames
            const names = teacher.names
            return {
                _id: teacher._id,
                names: teacher.names,
                surnames: teacher.surnames,
                fullName: `${surnames} ${names}`
            };
        });

        setTeacherSurnameList(modifiedNames);
    }, [allTeachers]);

    useEffect(() => {
        setTeacherList(teacherSurnameList.map(teacher => ({
            _id: teacher._id,
            name: teacher.names + " " + teacher.surnames,
        })))
    }, [teacherSurnameList]);

    const handleTeacherChange = (val: { name: string; _id: string } | null) => {
            const teacherValue = val ? val._id : '';
            const teacherValueName = val ? val.name : '';
            console.log(teacherValue)
            setSelectedTeacherId(teacherValue);
            setSelectedTeacher(teacherValueName)
    };

    const handleScheduleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedScheduleType(event.target.value)
    }

    return (
        <div className="d-flex">
            <div className="w-25 flex-1 bg-danger p-4">
                <select
                    className="form-select mb-2 w-100"
                    aria-label="Default select example"
                    value={selectedScheduleType}
                    onChange={handleScheduleTypeChange}
                >
                    <option value="" disabled hidden>Wybierz Rozkład</option>
                    <option value="teacher">Rozkład Nauczyciela</option>
                    <option value="student">Rozkład Ucznia</option>
                </select>
                {selectedScheduleType === "teacher" ? (
                    <SearchableDropdown
                        placeholder = "Wybierz nauczyciela..."
                        options={ teacherList }
                        label="name"
                        id="id"
                        selectedVal={ selectedTeacher }
                        handleChange={ (val) => handleTeacherChange(val) } // Set empty string if val is null
                    />
                ) : selectedScheduleType === "student" ? (
                    <>
                        <PrivateScheduleOptions onSendData={handleChildData}/>
                        {childMessage.semesterId ? (
                            <button className="btn btn-success mt-2" onClick={handleRefresh}>Zatwierdź</button>
                        ): null}
                    </>
                ): null}
            </div>
            <div className="main flex-3 bg-success w-100 p-2">
                {selectedScheduleType === "teacher" ? (
                    <AvailableTable _id={selectedTeacherId} classesAll={classes} facultiesAll={faculties} timetablesAll={timetables}/>
                ):(
                    selectedScheduleType === "student" && childMessageToSend.courseId && refreshKey > 0 ? (
                        <PrivateSchedule studentInfo={childMessageToSend} key={refreshKey}/>
                    ) : ("Wybierz typ rozkładu")
                )}
            </div>
        </div>);
};

export default Home;
