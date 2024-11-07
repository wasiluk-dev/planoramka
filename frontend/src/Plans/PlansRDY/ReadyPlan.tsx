import React, {useState, useEffect, useMemo} from 'react';
import apiService from "../../../services/apiService.tsx";
import * as dataType from "../../../services/databaseTypes.tsx";
import {TimeTables} from "../../../services/databaseTypes.tsx";
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
    const [showCurrentDay, setShowCurrentDay] = useState<number>(6);
    const [timeTables , setTimeTables] = useState<dataType.Classdata | null>(null);// Fetch data from API when component mounts
    const [periods, setPeriods] = useState<Array<dataType.Periods> | null>([])
    const [zajecia, setZajecia] = useState([])
    const [groupNumber, setGroupNumber] = useState<number>(0)
    const [groupTypes, setGroupTypes] = useState<Array<GroupInfo> | null>([])
    const [groupNames, setGroupNames] = useState({});
    const [fixedRows, setFixedRows]= useState<number>(14)
    const [tableData, setTableData] = useState<Record<string, (null | any)[]>>({}); // Initialize as an empty object

    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getTimeTables();
            setTimeTables(data); // Store fetched time tables in state
            setZajecia(data[0]?.classes)
            setGroupTypes(data[0]?.groups)
            for (let i:number = 0; i < 7; i++){
                if(data[0]?.schedules[i].weekdays.includes(showCurrentDay)){
                    setFixedRows(data[0]?.schedules[i].periods.length);
                    break;
                }
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (groupTypes.length > 0) { // Check if groupTypes is populated
            const names = groupTypes.reduce((accumulator, current) => {
                const acronym = current.classType.acronym; // Get the acronym
                const count = current.groupCount; // Get the groupCount
                accumulator[acronym] = count; // Set the acronym as key and count as value
                return accumulator; // Return the updated accumulator
            }, {} as Record<string, number>); // Initialize as an empty object with string keys and number values

            setGroupNames(names); // Update groupNames with the transformed data
        }
    }, [groupTypes]);


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

        const updatedGrid: Array<Array<TimeTables | null>> = Array(fixedRows)
            .fill(null)
            .map(() => Array(groupNumber).fill(" "));
        setGrid(updatedGrid);
    }, [normal, groupNumber]);

    // Update tableData whenever input changes
    useEffect(() => {
        if (groupTypes.length > 0) {
            const newTableData = groupTypes.reduce((acc, item) => {
                const acronym = item.classType.acronym;
                acc[acronym] = Array(fixedRows).fill(null);
                return acc;
            }, {} as Record<string, (null | any)[]>);

            setTableData(newTableData);
        }
    }, [groupTypes, showCurrentDay, fixedRows]);

// Assuming `tableData` and `setTableData` are already defined using useState

    useEffect(() => {
        // Example filteredClasses for demonstration; replace with actual logic
        const filteredClasses = zajecia.filter(
            (classItem) => classItem.weekday === showCurrentDay
        );

        // Update `tableData` based on `filteredClasses`
        setTableData((prevTableData) => {
            // Create a copy of the existing tableData to avoid direct mutation
            const newTableData = { ...prevTableData };

            // Populate table data with class items based on acronym and periodLocks
            filteredClasses.forEach((classItem) => {
                const { acronym, color } = classItem.classType;

                // Ensure `newTableData[acronym]` exists before accessing
                if (newTableData[acronym]) {
                    classItem.periodBlocks.forEach((period) => {
                        if (period <= fixedRows) {
                            // Update the newTableData for the corresponding period
                            newTableData[acronym][period - 1] = {
                                ...classItem, // Spread operator to include the whole classItem object
                            };
                        }
                    });
                }
            });

            return newTableData; // Return the updated tableData
        });
    }, [zajecia, showCurrentDay, fixedRows, setTableData]);


        useEffect(() => {
        if (zajecia.length > 0) {
            const filteredClasses = zajecia.filter(
                (classItem) => classItem.weekday === showCurrentDay
            );

            setTableData((prevTableData) => {
                const newTableData = { ...prevTableData };

                filteredClasses.forEach((classItem) => {
                    const { acronym } = classItem.classType;
                    if (newTableData[acronym]) {
                        classItem.periodBlocks.forEach((period) => {
                            if (period <= fixedRows) {
                                newTableData[acronym][period - 1] = {
                                    ...classItem,
                                };
                            }
                        });
                    }
                });

                return newTableData;
            });
        } else {
            setTableData({});
        }
    }, [zajecia, showCurrentDay, fixedRows, grid]);

    // console.log(tableData)

    const updateTableData = () => {
        if (zajecia.length > 0) {
            const filteredClasses = zajecia.filter(
                (classItem) => classItem.weekday === showCurrentDay
            );

            setTableData((prevTableData) => {
                const newTableData = {};

                // Initialize the table data for each group
                Object.keys(groupNames).forEach(acronym => {
                    newTableData[acronym] = Array(fixedRows).fill(null); // Create an array with nulls
                });

                filteredClasses.forEach((classItem) => {
                    const { acronym } = classItem.classType;

                    if (newTableData[acronym]) {
                        classItem.periodBlocks.forEach((period) => {
                            if (period <= fixedRows) {
                                newTableData[acronym][period - 1] = {
                                    ...classItem,
                                };
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
        const schedule = timeTables[0]?.schedules.find(schedule => schedule.weekdays.includes(newDay));
        if (schedule) {
            setFixedRows(schedule.periods.length);
        }
        updateTableData(); // Update table data whenever the day changes
    };

    // Update grid based on fixedRows and groupNumber
    useEffect(() => {
        const updatedGrid: Array<Array<TimeTables | null>> = Array.from({ length: fixedRows }, () => Array(groupNumber).fill(null));
        setGrid(updatedGrid);
    }, [fixedRows, groupNumber]);

    // Update table data when zajecia, showCurrentDay or fixedRows change
    useEffect(() => {
        updateTableData();
    }, [zajecia, showCurrentDay, fixedRows]);

    console.log(timeTables)
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


                        {grid.map((row, rowIndex) => {
                            return (
                                <tr key={rowIndex} className="table-dark text-center">
                                    {/* Time column */}
                                    <th scope="col" className="col-2">
                                        {timeTables ? (
                                            (showCurrentDay == 0 || showCurrentDay == 6) && timeTables[0]?.schedules[1]?.periods[rowIndex] ? (
                                                timeTables[0].schedules[1].periods[rowIndex].startTime + ' - ' + timeTables[0].schedules[1].periods[rowIndex].endTime
                                            ) : (showCurrentDay > 0 && showCurrentDay < 6 && timeTables[0]?.schedules[0]?.periods[rowIndex] ? (
                                                timeTables[0].schedules[0].periods[rowIndex].startTime + ' - ' + timeTables[0].schedules[0].periods[rowIndex].endTime
                                            ) : ("Error in showing period per day!"))
                                        ) : (
                                            <p>Loading...</p>
                                        )}
                                    </th>
                                    {/* Rowspan column */}
                                    {rowIndex === 0 && (
                                        <td rowSpan={grid.length} className="align-middle table-in p-0" colSpan={2}>
                                            <div className="table-container p-0 w-100 h-100"
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
                                                                className="table table-bordered border-secondary table-dark table-equal-rows position-relative bg-transparent"
                                                            >
                                                                <tbody>
                                                                {tableData[acronym].map((cellData, rowIndex) => (
                                                                    <tr key={rowIndex}>
                                                                        <td scope="row" className="p-0">
                                                                            {cellData ? (
                                                                                <div
                                                                                    className="text-black fw-bolder cell-content"
                                                                                    style={{backgroundColor: cellData.classType.color}}>
                                                                                    {cellData.subject.name}
                                                                                </div>
                                                                            ) : (
                                                                                <span
                                                                                    className="text-black fw-bolder"></span>
                                                                            )}
                                                                        </td>
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
                                                                className={`table table-bordered table-dark border-black table-equal-rows position-absolute top-0 z-${zIndex} bg-transparent`}
                                                            >
                                                                <tbody>
                                                                {tableData[acronym].map((cellData, rowIndex) => (
                                                                    <tr key={rowIndex}>
                                                                        {Array.from({length: columnCount}, (_, colIndex) => (
                                                                            <td key={colIndex} scope="col"
                                                                                className="bg-transparent p-0 col-1">
                                                                                {cellData && cellData.studentGroups.includes(colIndex + 1) ? (
                                                                                    <div
                                                                                        className="text-black fw-bolder cell-content"
                                                                                        style={{backgroundColor: cellData.classType.color}}
                                                                                    >
                                                                                        {cellData.subject.name}
                                                                                    </div>
                                                                                ) : (
                                                                                    <span
                                                                                        className="text-black fw-bolder"></span>
                                                                                )}
                                                                            </td>
                                                                        ))}
                                                                    </tr>
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