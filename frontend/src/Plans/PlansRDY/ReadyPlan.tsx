import React, {useEffect, useMemo, useState} from 'react';
import apiService from "../../../services/apiService.tsx";
import * as dataType from "../../../services/databaseTypes.tsx";
import {
    ClassPopulated,
    CoursePopulated,
    FacultyPopulated,
    SemesterPopulated,
    TimetablePopulated
} from "../../../services/databaseTypes.tsx";
import './planrdy.css'
import ECourseMode from "../../../../backend/src/enums/ECourseMode.ts";
import APIUtils from "../../utils/APIUtils.ts";
import ECourseCycle from "../../../../backend/src/enums/ECourseCycle.ts";
import PeriodBlock from "../../Components/PeriodBlock/PeriodBlock.tsx";
import {TestContext} from "node:test";


type ClassTypeHelper ={
    acronym: string;
    _id: string;
}

type GroupInfo = {
    classType: ClassTypeHelper;
    groupCount: number;
}

const day ={
    0: "Niedziela",
    1: "Poniedziałek",
    2: "Wtorek",
    3: "Środa",
    4: "Czwartek",
    5: "Piątek",
    6: "Sobota",
}


const  ReadyPlan: React.FC = () => {

    //Some data in hooks is not used, but it may be used later, dunno
    const [facultyCycles, setFacultyCycles] = useState<Array<ECourseCycle>>([])
    const [selectedFacultyCourses, setSelectedFacultyCourses] = useState<Array<Pick<CoursePopulated, "_id" | "code" | "name" | "specialization" | "semesters">>>([])
    const [timetables, setTimetables] = useState<Array<TimetablePopulated>>([])
    const [selectedTimetable, setSelectedTimetable] = useState<TimetablePopulated>()
    const [selectedCycle, setSelectedCycle] = useState<string>("")
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

    const [grid, setGrid] = useState<Array<Array<ClassPopulated | null>>>([]);
    const [showCurrentDay, setShowCurrentDay] = useState<number>(6);
    const [periods, setPeriods] = useState<Array<dataType.PeriodPopulated> | null>([])
    const [zajecia, setZajecia] = useState<Array<ClassPopulated>>([])
    const [groupNumber, setGroupNumber] = useState<number>(0)
    const [groupTypes, setGroupTypes] = useState<Array<GroupInfo> | null>([])
    const [groupNames, setGroupNames] = useState({});
    const [fixedRows, setFixedRows]= useState<number>(14)
    const [tableData, setTableData] = useState<Record<string, (null | any)[][]>>({});// Initialize as an empty object


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

    useEffect(() => {
        if (groupTypes && groupTypes.length > 0) { // Check if groupTypes is populated
            const names = groupTypes.reduce((accumulator, current) => {
                const acronym = current.classType.acronym; // Get the acronym
                accumulator[acronym] = current.groupCount; // Set the acronym as key and count as value
                return accumulator; // Return the updated accumulator
            }, {} as Record<string, number>); // Initialize as an empty object with string keys and number values
            setGroupNames(names); // Update groupNames with the transformed data
        }
    }, [groupTypes,selectedSemesterId]);


    useEffect(() => {
        if (zajecia.length > 0) {
            // @ts-ignore
            const allStudentGroups = zajecia.flatMap((item) => item.studentGroups || []);
            const uniqueStudentGroups = new Set(allStudentGroups);
            setGroupNumber(uniqueStudentGroups.size);
        }
    }, [zajecia]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getPeriods();
            setPeriods(data); // Store fetched time tables in state
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
                setZajecia(pickedTimetable.classes)
                setGroupTypes(pickedTimetable.groups)
                for (let i:number = 0; i < 7; i++){
                    if(pickedTimetable.schedules[i].weekdays.includes(showCurrentDay)){
                        setFixedRows(pickedTimetable.schedules[i].periods.length);
                        break;
                    }
                }
            }else {
                setSelectedTimetable(undefined);
            }
            updateTableData();
        }else {
            console.warn("Tajmtejbyls nie istnieje")
        }

    }

    const normal = useMemo(() => {
        return periods?.filter((item) =>
            item.weekdays.includes(1)
        ).sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
    }, [periods]);

    useEffect(() => {
        // Check if `normal` is defined and has a valid length
        if (!normal || normal.length === 0) return;

        const updatedGrid: Array<Array<ClassPopulated | null>> = Array(fixedRows)
            .fill(null)
            .map(() => Array(groupNumber).fill(" "));
        setGrid(updatedGrid);
    }, [normal, groupNumber, selectedSemesterId]);

    // Update tableData whenever input changes
    useEffect(() => {
        if (groupTypes && groupTypes.length > 0) {
            const newTableData = groupTypes.reduce((acc, group) => {
                const acronym = group.classType.acronym;
                acc[acronym] = Array.from({ length: fixedRows }, () =>
                    Array(group.groupCount).fill(null)
                ); // Nested array: rows × groupCount
                return acc;
            }, {} as Record<string, (null | any)[][]>);
            setTableData(newTableData);
        }
    }, [groupTypes, showCurrentDay, fixedRows, selectedSemesterId]);

    useEffect(() => {
        const filteredClasses = zajecia.filter(
            (classItem) => classItem.weekday === showCurrentDay
        );

        setTableData((prevTableData) => {
            const newTableData = { ...prevTableData };

            filteredClasses.forEach((classItem) => {
                const { acronym } = classItem.classType;
                const groups = classItem.studentGroups || [];

                if (newTableData[acronym]) {
                    classItem.periodBlocks.forEach((period) => {
                        if (period <= fixedRows) {
                            groups.forEach((groupIdx) => {
                                newTableData[acronym][period - 1][groupIdx - 1] = {
                                    ...classItem,
                                };
                            });
                        }
                    });
                }
            });

            return newTableData;
        });
    }, [zajecia, showCurrentDay, fixedRows, setTableData, selectedSemesterId]);


    useEffect(() => {
        if (zajecia.length > 0) {
            const filteredClasses = zajecia.filter(
                (classItem) => classItem.weekday === showCurrentDay
            );

            setTableData((prevTableData) => {
                const newTableData = { ...prevTableData };

                // Ensure all acronyms are initialized correctly
                Object.keys(groupNames).forEach((acronym) => {
                    const groupCount = groupNames[acronym] || 1; // Default to 1 group if undefined
                    newTableData[acronym] = Array.from({ length: fixedRows }, () =>
                        Array(groupCount).fill(null)
                    );
                });

                // Populate filtered classes into the table data
                filteredClasses.forEach((classItem) => {
                    const { acronym } = classItem.classType;
                    const groups = classItem.studentGroups || []; // Groups this class applies to

                    if (newTableData[acronym]) {
                        classItem.periodBlocks.forEach((period) => {
                            if (period <= fixedRows) {
                                groups.forEach((groupIdx) => {
                                    // Update the specific cell for the group
                                    newTableData[acronym][period - 1][groupIdx - 1] = {
                                        ...classItem,
                                    };
                                });
                            }
                        });
                    }
                });

                return newTableData;
            });
        } else {
            setTableData({});
        }
    }, [zajecia, showCurrentDay, fixedRows, groupNames, selectedSemesterId]);


    const updateTableData = () => {
        if (zajecia.length > 0) {
            const filteredClasses = zajecia.filter(
                (classItem) => classItem.weekday === showCurrentDay
            );

            setTableData(() => {
                const newTableData = {};

                // Initialize the table data for each group
                Object.keys(groupNames).forEach((acronym) => {
                    const groupCount = groupNames[acronym] || 1; // Number of groups for this acronym
                    newTableData[acronym] = Array.from({ length: fixedRows }, () =>
                        Array(groupCount).fill(null) // Create a 2D array: rows × groupCount
                    );
                });

                // Populate the table data based on filteredClasses
                filteredClasses.forEach((classItem) => {
                    const { acronym } = classItem.classType;
                    const groups = classItem.studentGroups || []; // Groups the class is associated with

                    if (newTableData[acronym]) {
                        classItem.periodBlocks.forEach((period) => {
                            if (period <= fixedRows) {
                                groups.forEach((groupIdx) => {
                                    // Place data into the corresponding row and group column
                                    newTableData[acronym][period - 1][groupIdx - 1] = {
                                        ...classItem,
                                    };
                                });
                            }
                        });
                    }
                });

                return newTableData;
            });

        } else {
            setTableData({});
        }
    };

    const changeDay = (newDay: number) => {
        setShowCurrentDay(newDay); // Set the new current day
        if (selectedTimetable){
            const schedule = selectedTimetable.schedules.find(schedule => schedule.weekdays.includes(newDay));
            if (schedule) {
                setFixedRows(schedule.periods.length);
            }
            updateTableData(); // Update table data whenever the day changes
        } else {
            console.warn("Nie wybrano TimeTable")
        }
    };

    // Update grid based on fixedRows and groupNumber
    useEffect(() => {
        const updatedGrid: Array<Array<ClassPopulated | null>> = Array.from({ length: fixedRows }, () => Array(groupNumber).fill(null));
        setGrid(updatedGrid);
    }, [fixedRows, groupNumber, selectedSemesterId]);

    // Update table data when zajecia, showCurrentDay or fixedRows change
    useEffect(() => {
        updateTableData();
    }, [zajecia, showCurrentDay, fixedRows, selectedSemesterId, groupNames]);

    console.log(tableData)

    return (
        <>
            <div className='d-flex flex-row p-3'>
                <div className="bg-secondary text-center w-15">
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
                </div>
                <div className="mb-1 bg-secondary ms-5 d-flex flex-row w-100 table-combo">
                    {/*TABELA ZAJĘCIOWA*/}
                    {selectedTimetable ? (
                        <table className="table table-bordered border-primary me-4 table-fixed-height table-combo-child"
                               style={{height: '100%'}}>
                            <tbody style={{height: '100%'}}>
                            <tr className="table-dark text-center">
                                <td className="table-dark text-center fw-bolder fs-5" colSpan={groupNumber + 1}>
                                    <div className="d-flex justify-content-center"> {/* Flexbox container */}
                                        {Object.entries(day)
                                            .filter(([key]) => key !== '0') // Filter out the entry with key '0'
                                            .map(([key, value]) => (
                                                <div
                                                    key={key}
                                                    className="flex-fill text-center me-2" // Flex item
                                                >
                                                    {key === showCurrentDay.toString() ? (
                                                        <div className="fw-bold" role="button">{value}</div>
                                                    ) : (
                                                        <div className="fw-light" role="button" onClick={() => changeDay(parseInt(key))}>{value}</div>
                                                    )}

                                                </div>
                                            ))
                                        }

                                        {/* Now display the entry with key '0' at the end */}
                                        {day['0'] && (
                                            <div
                                                key="0"
                                                className="flex-fill text-center me-2" // Flex item
                                            >
                                                {showCurrentDay.toString() === '0' ? (
                                                    <div className="fw-bold"  role="button">{day['0']}</div>
                                                ) : (
                                                    <div className="fw-light" role="button" onClick={() => changeDay(0)}>{day['0']}</div>
                                                )}
                                            </div>
                                        )}

                                    </div>
                                </td>
                            </tr>
                            <tr className="table-dark godzina">
                                {groupTypes ? (
                                    <th className='text-center' rowSpan={groupTypes.length-2}>Godzina</th>
                                ) : (
                                    <th className='text-center'>Godzina</th>
                                )}
                            </tr>
                            {groupTypes ? (
                                groupTypes.map((group) => (
                                    <tr className="table-dark d-flex flex-row" key={group.classType._id}>
                                        {Array.from({length: group.groupCount}).map((_, i) => (
                                            <th key={i} className="text-center w-100 border-secondary border border-1 grupy">
                                                {group.classType.acronym} {i + 1}
                                            </th>

                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <th>Error</th>
                                </tr>
                            )}


                            {grid.map((_row, rowIndex) => {
                                return (
                                    <tr key={rowIndex} className="table-dark text-center">
                                        {/* Time column */}
                                        <th scope="col" className="col-2">
                                            {selectedTimetable ? (
                                                (showCurrentDay == 0 || showCurrentDay == 6) && selectedTimetable.schedules[1]?.periods[rowIndex] ? (
                                                    selectedTimetable.schedules[1].periods[rowIndex].startTime + ' - ' + selectedTimetable.schedules[1].periods[rowIndex].endTime
                                                ) : (showCurrentDay > 0 && showCurrentDay < 6 && selectedTimetable.schedules[0]?.periods[rowIndex] ? (
                                                    selectedTimetable.schedules[0].periods[rowIndex].startTime + ' - ' + selectedTimetable.schedules[0].periods[rowIndex].endTime
                                                ) : ("Error in showing period per day!"))
                                            ) : (
                                                <p>Loading...</p>
                                            )}
                                        </th>
                                        {/* Rowspan column */}
                                        {rowIndex === 0 && (
                                            <td rowSpan={grid.length} className="align-middle table-in p-0" colSpan={2}>
                                                <div className="table-container p-0 w-100 h-100 table-combo"
                                                     style={{position: 'relative'}}>
                                                    {Object.keys(tableData || {}).map((acronym, idx) => {
                                                        // Check if the tableData for this acronym contains non-null values
                                                        const hasData = tableData[acronym]?.some((cellData) => cellData !== null);

                                                        if (!hasData) return null; // Skip empty groups

                                                        // Determine `z-index` for stacking
                                                        const zIndex = idx + 1;

                                                        // Number of columns for this acronym based on groupNames
                                                        const columnCount = groupNames[acronym] || 1;

                                                        // First table formatting
                                                        if (idx === 0) {
                                                            return (
                                                                <table
                                                                    key={acronym}
                                                                    className="table table-bordered border-secondary table-dark table-equal-rows position-relative bg-transparent table-combo-child"
                                                                >
                                                                    <tbody>
                                                                    {tableData[acronym]?.map((row, rowIndex) => (
                                                                        <tr key={rowIndex}>
                                                                            {(() => {
                                                                                const mergedCells = [];
                                                                                let colSpan = 1;

                                                                                for (let colIndex = 0; colIndex < row.length; colIndex++) {
                                                                                    const currentCell = row[colIndex];
                                                                                    const nextCell = row[colIndex + 1];

                                                                                    if (
                                                                                        currentCell &&
                                                                                        nextCell &&
                                                                                        JSON.stringify(currentCell) === JSON.stringify(nextCell)
                                                                                    ) {
                                                                                        colSpan++; // Increment colspan for consecutive identical cells
                                                                                    } else {
                                                                                        // Push merged cell (or single cell if no merge)
                                                                                        mergedCells.push(
                                                                                            <td
                                                                                                key={colIndex}
                                                                                                colSpan={colSpan}
                                                                                                className="p-0"
                                                                                            >
                                                                                                {currentCell ? (
                                                                                                    <PeriodBlock
                                                                                                        color={currentCell.classType.color}
                                                                                                        organizer={currentCell.organizer}
                                                                                                        roomNumber={currentCell.room.roomNumber}
                                                                                                        subjectName={currentCell.subject.name}
                                                                                                    />
                                                                                                ) : (
                                                                                                    <span
                                                                                                        className="text-black fw-bolder"></span> // Empty cell placeholder
                                                                                                )}
                                                                                            </td>
                                                                                        );
                                                                                        colSpan = 1; // Reset colspan for the next group
                                                                                    }
                                                                                }

                                                                                return mergedCells;
                                                                            })()}
                                                                        </tr>
                                                                    ))}
                                                                    </tbody>


                                                                </table>
                                                            );
                                                        } else {
                                                            // Subsequent tables formatting
                                                            return (
                                                                <table
                                                                    key={acronym}
                                                                    className={`table table-bordered table-dark border-black table-equal-rows position-relative bg-transparent table-combo-child`}
                                                                >
                                                                    <tbody>
                                                                    {Array.isArray(tableData[acronym]) &&
                                                                        tableData[acronym].map((row, rowIndex) => (
                                                                            Array.isArray(row) ? (
                                                                                <tr key={rowIndex}>
                                                                                    {(() => {
                                                                                        const mergedCells: JSX.Element[] = [];
                                                                                        let colSpan = 1;

                                                                                        for (let colIndex = 0; colIndex < row.length; colIndex++) {
                                                                                            const currentCell = row[colIndex];
                                                                                            const nextCell = row[colIndex + 1];

                                                                                            // If current cell and next cell are identical, increase colSpan
                                                                                            if (currentCell && nextCell &&
                                                                                                JSON.stringify(currentCell) === JSON.stringify(nextCell)) {
                                                                                                colSpan++; // Increment colspan for consecutive identical cells
                                                                                            } else {
                                                                                                // Render the current cell with the correct colSpan
                                                                                                mergedCells.push(
                                                                                                    <td key={colIndex}
                                                                                                        colSpan={colSpan}
                                                                                                        className="bg-transparent p-0 col-1">
                                                                                                        {currentCell ? (
                                                                                                            <PeriodBlock
                                                                                                                color={currentCell.classType.color}
                                                                                                                organizer={currentCell.organizer}
                                                                                                                roomNumber={currentCell.room.roomNumber}
                                                                                                                subjectName={currentCell.subject.name}
                                                                                                            />
                                                                                                        ) : (
                                                                                                            <span
                                                                                                                className="text-black fw-bolder"></span>
                                                                                                        )}
                                                                                                    </td>
                                                                                                );
                                                                                                colSpan = 1; // Reset colSpan for the next group
                                                                                            }
                                                                                        }

                                                                                        return mergedCells;
                                                                                    })()}
                                                                                </tr>
                                                                            ) : null
                                                                        ))}
                                                                    </tbody>

                                                                </table>
                                                            );
                                                        }
                                                    })}
                                                </div>

                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    ) : null}
                </div>
            </div>
        </>
    );
};

export default ReadyPlan;

//TODO: ogarnąć divy żeby były na całośc i nie było ich 213769; GOdziny zależne do dnia;