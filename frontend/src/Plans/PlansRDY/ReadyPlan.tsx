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

const  ReadyPlan: React.FC = () => {

    const [timeTables , setTimeTables] = useState<dataType.Classdata | null>(null);// Fetch data from API when component mounts
    const [periods, setPeriods] = useState<Array<dataType.Periods> | null>(null)
    const [zajecia, setZajecia] = useState([])
    const [groupNumber, setGroupNumber] = useState<number>(0)
    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getTimeTables();
            setTimeTables(data); // Store fetched time tables in state
            setZajecia(data[0]?.classes)
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


    const skipRows = Array(groupNumber).fill(0);
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


                        <tr className="table-dark">
                            <th className='text-center'>Godzina</th>
                            {groupNumber > 0 ? (
                                Array.from({length: groupNumber}, (_, i) => i + 1).map((num) => (
                                    <th key={num} className='text-center'>Grupa {num}</th>
                                ))
                            ) : (
                                <th>Error</th>
                            )}
                        </tr>

                        {grid.map((row, rowIndex) => {
                            return (
                                <tr key={rowIndex} className="table-dark text-center">
                                    {/* Time column */}
                                    <th scope="col" className="col-1">
                                        {timeTables ? (
                                            timeTables[0].schedules[0].periods[rowIndex].startTime + ' - ' + timeTables[0].schedules[0].periods[rowIndex].endTime
                                        ) : (
                                            <p>Loading...</p>
                                        )}
                                    </th>

                                    {row.map((item, colIndex) => {
                                        // If skipRows[colIndex] is greater than 0, it means we need to skip rendering this row for that column
                                        if (skipRows[colIndex] > 0) {
                                            skipRows[colIndex]--; // Decrease the skip count for the next row
                                            return null; // Skip rendering for this column in this row
                                        }

                                        let rowspan = 1; // Default rowspan is 1
                                        let cellValue = null; // To store the cell value for comparison

                                        // Check if rowspan needs to be applied for this item based on periodBlocks
                                        zajecia.forEach((zajecie) => {
                                            if (
                                                zajecie.periodBlocks.includes(rowIndex + 1) && // Check if the current period is in periodBlocks
                                                zajecie.studentGroups.includes(colIndex + 1) && // Check if the group matches
                                                zajecie.weekday === showCurrentDay // Check if the weekday is correct
                                            ) {
                                                // Get the value for the cell (for rowspan comparison)
                                                cellValue = zajecie.subject.name;

                                                // Check if there are additional consecutive periods to merge
                                                let countConsecutivePeriods = 0;

                                                for (let i = rowIndex + 1; i < grid.length; i++) {
                                                    const nextZajecie = zajecia.find(
                                                        (z) =>
                                                            z.periodBlocks.includes(i + 1) &&
                                                            z.studentGroups.includes(colIndex + 1) &&
                                                            z.weekday === showCurrentDay
                                                    );

                                                    if (nextZajecie && nextZajecie.subject.name === cellValue) {
                                                        countConsecutivePeriods++; // Count how many consecutive periods have the same value
                                                    } else {
                                                        break; // Stop if there is no consecutive period
                                                    }
                                                }

                                                rowspan = countConsecutivePeriods + 1; // Add 1 for the current row
                                                skipRows[colIndex] = countConsecutivePeriods; // Mark the next rows to be skipped for this column
                                            }
                                        });

                                        return (
                                            <td
                                                key={colIndex}
                                                className="table-dark col-3 text-center"
                                                scope="col"
                                                rowSpan={rowspan} // Apply the calculated rowspan
                                            >
                                                {timeTables ? (
                                                    zajecia.map((zajecie) => {
                                                        const shouldRender =
                                                            zajecie.periodBlocks.includes(rowIndex + 1) &&
                                                            zajecie.studentGroups.includes(colIndex + 1) &&
                                                            zajecie.weekday === showCurrentDay &&
                                                            zajecie.subject.name; // Ensure subject name exists

                                                        // Only render the <div> if shouldRender is true
                                                        return shouldRender ? (
                                                            <div
                                                                key={zajecie._id}
                                                                style={{
                                                                    backgroundColor: zajecie.classType.color,
                                                                    color: 'black',
                                                                    fontWeight: 'bold',
                                                                    height: '100%', // Ensure the div fills the height of td
                                                                    display: 'flex', // Add flexbox to ensure the content stretches
                                                                    alignItems: 'center', // Optional: center the text vertically
                                                                    justifyContent: 'center', // Optional: center the text horizontally
                                                                }}
                                                            >
                                                                {zajecie.subject.name}
                                                            </div>
                                                        ) : null; // Return null if shouldRender is false
                                                    })
                                                ) : (
                                                    <p>Loading...</p>
                                                )}
                                            </td>
                                        );
                                    })}
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