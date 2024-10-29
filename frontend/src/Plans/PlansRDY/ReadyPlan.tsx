import React, {useState, useEffect, useMemo} from 'react';
import apiService from "../../../services/apiService.tsx";
import * as dataType from "../../../services/databaseTypes.tsx";
import {Schedule, TimeTables} from "../../../services/databaseTypes.tsx";
import './planrdy.css'

const kierunki: { [key: number]: { [key: number]: string } } = {
    1: {
        1: 'K1_1',
        2: 'K1_2',
        3: 'K1_3'
    },
    2: {
        1: 'K2_1',
        2: 'K2_2',
        3: 'K2_3'
    },
    3: {
        1: 'K3_1',
        2: 'K3_2',
        3: 'K3_3'
    }
};

type ClassTypeHelper ={
    acronym: string;
    _id: string;
}

type GroupInfo = {
    classType: ClassTypeHelper;
    groupCount: number;
}

let showCurrentDay: number = 6

const day ={
    0: "Niedziela",
    1: "Poniedziałek",
    2: "Wtorek",
    3: "Środa",
    4: "Czwartek",
    5: "Piątek",
    6: "Sobota",
}


////////////////
type ClassType = {
    acronym: string;
    color: string;
    name: string;
};

type Organizer = {
    firstName: string;
    lastName: string;
    fullName: string;
};

type Room = {
    number: string;
    numberSecondary: string;
};

type Subject = {
    name: string;
    short: string;
};

type ClassItem = {
    classType: ClassType;
    organizer: Organizer;
    periodLocks: number[];
    room: Room;
    subject: Subject;
};

interface ClassScheduleProps {
    classes: ClassItem[];
    fixedRows?: number;
}
/////////////



const  ReadyPlan: React.FC = () => {

    const [timeTables , setTimeTables] = useState<dataType.Classdata | null>(null);// Fetch data from API when component mounts
    const [periods, setPeriods] = useState<Array<dataType.Periods> | null>([])
    const [zajecia, setZajecia] = useState([])
    const [groupNumber, setGroupNumber] = useState<number>(0)
    const [groupTypes, setGroupTypes] = useState<Array<GroupInfo> | null>(null)
    const [maxGroupNumber, setMaxGroupNumber] = useState<number>(0)
    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getTimeTables();
            setTimeTables(data); // Store fetched time tables in state
            setZajecia(data[0]?.classes)
            setGroupTypes(data[0]?.groups)
        };

        fetchData();
    }, []);

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

    const [selectedWydzial, setSelectedWydzial] = useState<string>("");
    const [selectedKierunek, setSelectedKierunek] = useState<string>("");

    const handleWydzialChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedWydzial(event.target.value);
        setSelectedKierunek("");
    };

    const handleKierunekChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setSelectedKierunek(selectedValue);
    };

    const kierunkiOptions = selectedWydzial ? Object.entries(kierunki[parseInt(selectedWydzial)]) : [];

    const [grid, setGrid] = useState<Array<Array<TimeTables | null>>>([]);

    const normal = useMemo(() => {
        return periods?.filter((item) =>
            item.weekdays.includes(1)
        ).sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
    }, [periods]);

    useEffect(() => {
        // Check if `normal` is defined and has a valid length
        if (!normal || normal.length === 0) return;

        const updatedGrid: Array<Array<TimeTables | null>> = Array(normal.length)
            .fill(null)
            .map(() => Array(groupNumber).fill(" "));
        setGrid(updatedGrid);
    }, [normal, groupNumber]);

    useEffect(() => {
        if (groupTypes && groupTypes.length > 0) {
            const maxCount = Math.max(...groupTypes.map(group => group.groupCount));
            setMaxGroupNumber(maxCount);
        }
    }, [groupTypes]);


    const skipRows = Array(groupNumber).fill(0);
    console.log(timeTables)
    const fixedRows: number = 14
    const tableData = {
        W: Array(fixedRows).fill(null),
        PS: Array(fixedRows).fill(null),
    };
    const filteredClasses = zajecia.filter(classItem => classItem.weekday === showCurrentDay);
    // Populate table data with class items based on acronym and periodLocks
    filteredClasses.forEach((classItem) => {
        const { acronym, color } = classItem.classType; // Get classType properties
        if (tableData[acronym as 'W' | 'PS']) {
            classItem.periodBlocks.forEach((period) => {
                if (period <= fixedRows) {
                    // Store the entire class item for the corresponding period
                    tableData[acronym as 'W' | 'PS'][period - 1] = {
                        ...classItem // Spread operator to include the whole classItem object
                    };
                }
            });
        }
    });

console.log(tableData)
    return (
        <>
            <h1 className='text-center'> PLAN ZAJĘĆ</h1>
            <div className='d-flex flex-row p-3'>
                <div className="bg-secondary text-center w-15">
                    <select
                        className="form-select"
                        aria-label="Default select example"
                        value={selectedWydzial}
                        onChange={handleWydzialChange}
                    >
                        <option value="" disabled hidden>Wybierz wydział</option>
                        <option value="1">Wydział 1</option>
                        <option value="2">Wydział 2</option>
                        <option value="3">Wydział 3</option>
                    </select>

                    {selectedWydzial && (
                        <div className="">
                            <select
                                className="form-select"
                                aria-label="Default select example"
                                value={selectedKierunek}
                                onChange={handleKierunekChange}
                            >
                                <option value="" disabled hidden>Wybierz kierunek</option>
                                {kierunkiOptions.map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {selectedKierunek && (
                        <div className="mt-2">
                        </div>
                    )}
                </div>
                <div className="mb-1 bg-secondary ms-5 d-flex flex-row w-100">
                    {/*TABELA ZAJĘCIOWA*/}
                    <table className="table table-bordered border-primary me-4 table-fixed-height"
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
                                                    <div className="fw-bold">{value}</div>
                                                ) : (
                                                    <div className="fw-light">{value}</div>
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
                                                <div className="fw-bold">{day['0']}</div>
                                            ) : (
                                                <div className="fw-light">{day['0']}</div>
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


                        {grid.map((row, rowIndex) => {
                            return (
                                <tr key={rowIndex} className="table-dark text-center">
                                    {/* Time column */}
                                    <th scope="col" className="col-2">
                                        {timeTables ? (
                                            timeTables[0].schedules[0].periods[rowIndex].startTime + ' - ' + timeTables[0].schedules[0].periods[rowIndex].endTime
                                        ) : (
                                            <p>Loading...</p>
                                        )}
                                    </th>

                                    {/* Rowspan column */}
                                    {rowIndex === 0 && (
                                        <td rowSpan={grid.length} className="align-middle table-in p-0" colSpan={2}>
                                            <div className="table-container p-0 w-100 h-100" style={{
                                                position: 'relative',
                                            }}> {/* Adjust height as needed */}
                                                <table
                                                    className="table table-bordered border-secondary table-dark table-equal-rows z-4 position-relative">
                                                    <tbody>
                                                    {tableData['W'].map((cellData, index) => (
                                                        <tr key={index}>
                                                            <td scope="row" className="p-0">
                                                                {cellData ? (
                                                                    <div className="text-black fw-bolder cell-content"
                                                                         style={{backgroundColor: cellData.classType.color}}>
                                                                        {cellData.subject.name}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-black fw-bolder"></span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                                <table
                                                    className="table table-bordered table-dark border-black table-equal-rows position-absolute top-0 z-1 bg-transparent">
                                                    <tbody>
                                                    {tableData['PS'].map((cellData, index) => (
                                                        <tr key={index} className='bg-transparent'>
                                                            <td scope="row" className='bg-transparent p-0'>
                                                                {cellData ? (
                                                                    <div className="text-black fw-bolder cell-content"
                                                                         style={{backgroundColor: cellData.classType.color}}>
                                                                        {cellData.subject.name}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-black fw-bolder"></span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>

                                            </div>

                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
                <div className='flex-sm-grow-1 ms-5 w-15 bg-success'>
                    Tutaj bendom szczegóły, szczególiki
                </div>
            </div>
        </>
    );
};

export default ReadyPlan;

//TODO: ogarnąć divy żeby były na całośc i nie było ich 213769; GOdziny zależne do dnia;