import React, {useEffect, useState} from "react";
import ECourseCycle from "../../../../backend/src/enums/ECourseCycle.ts";
import './PrivateSchedule.css'
import {
    CoursePopulated,
    FacultyPopulated,
    SemesterPopulated,
    TimetablePopulated
} from "../../../services/databaseTypes.tsx";
import ECourseMode from "../../../../backend/src/enums/ECourseMode.ts";
import apiService from "../../../services/apiService.tsx";
import APIUtils from "../../utils/APIUtils.ts";

type StudentInfo = {
    facultyId: string;
    mode: ECourseMode;
    cycle: ECourseCycle;
    courseId: string;
    semesterId: string;
}

type ChildProps = {
    onSendData: (data: StudentInfo) => void; // Define the type for the callback prop
}

const PrivateScheduleOptions:React.FC<ChildProps> = (props) => {

    const sendDataToParent = () => {
        if (!messageToParent){
            console.error("Brak wiadomości!")
        }else {
            props.onSendData(messageToParent); // Pass data to parent via the callback
        }
    };

    //Some data in hooks is not used, but it may be used later, dunno
    const [messageToParent, setMessageToParent] = useState<StudentInfo>()
    const [facultyCycles, setFacultyCycles] = useState<Array<ECourseCycle>>([])
    const [selectedFacultyCourses, setSelectedFacultyCourses] = useState<Array<Pick<CoursePopulated, "_id" | "code" | "name" | "specialization" | "semesters">>>([])
    const [timetables, setTimetables] = useState<Array<TimetablePopulated>>([])
    const [selectedTimetable, setSelectedTimetable] = useState<TimetablePopulated>()
    const [selectedCycle, setSelectedCycle] = useState<string>("")
    const [selectedCycleNum, setSelectedCycleNum] = useState<ECourseCycle>(0)

    const [faculties, setFaculties] = useState<Array<FacultyPopulated>>([])
    const [selectedFaculty, setSelectedFaculty] = useState<FacultyPopulated>()
    const [selectedFacultyId, setSelectedFacultyId] = useState<string>("")
    const [selectedStudyMode, setSelectedStudyMode] = useState<string>()
    const [selectedStudyModeNum, setSelectedStudyModeNum] = useState<ECourseMode>(0)
    const [courses, setCourses] = useState<Array<CoursePopulated>>([])
    const [availableCourses, setAvailableCourses] = useState<Array<CoursePopulated>>([])
    const [selectedCourse, setSelectedCourse] = useState<CoursePopulated>()
    const [selectedCourseId, setSelectedCourseId] = useState<string>("")
    const [semesterList, setSemesterList] = useState<Array<SemesterPopulated>>([])
    const [selectedSemesterId, setSelectedSemesterId] = useState<string>("")


    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getFaculties();
            setFaculties(data);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getCourses();
            setCourses(data);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getTimetables();
            setTimetables(data)
        };
        fetchData();
    }, []);

    const handleFacultyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const faculty = faculties.find((faculty) => faculty._id === event.target.value);
        setSelectedFaculty(faculty)
        setSelectedFacultyId(event.target.value)
        setSelectedStudyMode("")
        setSelectedFacultyCourses(APIUtils.getFacultyCourses(faculties, event.target.value))
        setFacultyCycles(APIUtils.getCourseCycles(courses))
        setSelectedStudyMode("");
        setSelectedSemesterId("")
        setSelectedCourseId("")
        setSelectedCycle("")
    };

    const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value as keyof typeof ECourseMode;
        const selectedStudyMode = ECourseMode[value as keyof typeof ECourseMode];
        setSelectedStudyMode(event.target.value);
        setSelectedStudyModeNum(selectedStudyMode)
        setSelectedSemesterId("")
        setSelectedCourseId("")
        setSelectedCycle("")
    };

    const handleCycleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value as keyof typeof ECourseCycle;
        const selectedCycle = ECourseCycle[value as keyof typeof ECourseCycle];
        setSelectedCycle(event.target.value)
        setSelectedCycleNum(selectedCycle)
        setAvailableCourses(APIUtils.getCoursesOfCycle(courses, selectedCycle))
        setSelectedSemesterId("")
        setSelectedCourseId("")
    }
    const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSemesterId("")
        setSelectedCourseId(event.target.value)
        const selected = courses.find((course) => course._id === event.target.value)
        setSelectedCourse(selected)
        if (selected?.semesters && selected?.semesters.length > 0){
            setSemesterList(selected?.semesters)
        }else {
            setSemesterList([])
        }
    }
    const handleSemesterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSemesterId(event.target.value)
        if (timetables){
            const pickedTimetable = timetables.find(timetable => timetable.semester === event.target.value);
            if (pickedTimetable) {
                setSelectedTimetable(pickedTimetable);
                // setGroupTypes(pickedTimetable.groups)
            }else {
                setSelectedTimetable(undefined);
            }
        }else {
            console.warn("Tajmtejbyls nie istnieje")
        }

        if (event.target.value && selectedCycleNum &&
            selectedCourseId && selectedStudyModeNum &&
            selectedFacultyId){
            const message: StudentInfo = {
                facultyId: selectedFacultyId,
                mode: selectedStudyModeNum,
                courseId: selectedCourseId,
                semesterId: event.target.value,
                cycle: selectedCycleNum
            }
            setMessageToParent(message);
        }else {
            console.error("Błąd w ustawianiu informacji do wyświetlenia!")
        }

    }

    useEffect(() => {
        if (messageToParent?.semesterId){
            sendDataToParent();
        }
    }, [messageToParent]);

    return (
        <>
            <select
                className="form-select"
                aria-label="Default select example"
                value={selectedFacultyId}
                onChange={handleFacultyChange}
            >
                <option value="" disabled hidden>Wybierz Wydział</option>
                {faculties.map((faculty) => (
                    faculty.courses.length > 0 ? (
                            <option key={faculty._id} value={faculty._id}>
                                {faculty.name}
                            </option>
                        ):
                        (<option disabled key={faculty._id} value={faculty._id}>
                            {faculty.name}
                        </option>)
                ))}
            </select>

            {selectedFacultyId && (
                <div className="mt-2">
                    <select
                        className="form-select"
                        aria-label="Default select example"
                        value={selectedStudyMode}
                        onChange={handleModeChange}
                    >
                        <option value="" disabled hidden>Wybierz Tryb</option>
                        {Object.values(ECourseMode)
                            .filter((value) => isNaN(Number(value)))
                            .map((value) =>
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            )}
                    </select>
                </div>
            )}

            {selectedFacultyId && selectedStudyMode && (
                <div className="mt-2">
                    <select
                        className="form-select"
                        aria-label="Default select example"
                        value={selectedCycle}
                        onChange={handleCycleChange}
                    >
                        <option value="" disabled hidden>Wybierz Cykl</option>
                        {Object.values(ECourseCycle)
                            .filter((value) => isNaN(Number(value)))
                            .map((value, index) =>
                                facultyCycles.includes(index) ? (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ) : (
                                    <option key={value} disabled value={value}>
                                        {value}
                                    </option>
                                )
                            )}
                    </select>
                </div>
            )}
            {selectedFacultyId && selectedStudyMode && selectedCycle &&(
                <div className="mt-2">
                    <select
                        className="form-select"
                        aria-label="Default select example"
                        value={selectedCourseId}
                        onChange={handleCourseChange}
                    >
                        <option value="" disabled hidden>Wybierz kierunek</option>
                        {availableCourses.map((course) => (
                            course.mode === selectedStudyModeNum ? (
                                <option key={course._id} value={course._id}>
                                    {course.name + (course.specialization ? (` (${course.specialization})`) : (""))}
                                </option>
                            ) : null
                        ))}
                    </select>
                </div>
            )}
            {selectedFacultyId && selectedStudyMode && selectedCycle && selectedCourseId &&(
                <div className="mt-2">
                    {semesterList.length > 0 ? (
                        <select
                            className="form-select"
                            aria-label="Default select example"
                            value={selectedSemesterId}
                            onChange={handleSemesterChange}
                        >
                            <option value="" disabled hidden>Wybierz Semestr</option>
                            {semesterList.map((semester) => (
                                <option key={semester._id}
                                        value={semester._id}>{"Semestr " + semester.index}</option>
                            ))}
                        </select>
                    ) : (
                        "Brak semestrów do wyświetlenia"
                    )}
                </div>
            )}
        </>
    );
};

export default PrivateScheduleOptions;