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

    console.log(timeTables)
    return (
        <>
            <h1 className='text-center'> PLAN ZAJĘĆ</h1>
            <div className='d-flex flex-row p-3 mx-3'>
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
                        {/*TABELA PIĄTKOWA*/}
                        <table className="table table-striped table-hover table-bordered border-primary me-4 table-fixed-height">
                            <tbody>
                            <tr className="table-dark text-center">
                                <td className="table-dark text-center fw-bolder fs-5" colSpan={3}>
                                    PIĄTEK
                                </td>

                            </tr>
                            <tr className="table-dark">
                                <th className='text-center'>Godzina</th>
                                {groupNumber > 0 ? (
                                    Array.from({length: groupNumber}, (_, i) => i + 1).map((num) => (
                                        <th key={num} className='text-center'> Grupa {num}</th>
                                    ))
                                ) : (
                                    <th>Error</th>
                                )}
                            </tr>
                            {grid.map((row, rowIndex) => (
                                <tr key={rowIndex} className="table-dark text-center">
                                    <th scope="col" className='col-2'>
                                        {timeTables ? (timeTables[0].schedules[0].periods[rowIndex].startTime + " - " + timeTables[0].schedules[0].periods[rowIndex].endTime) : (
                                            <p>Loading...</p>)}
                                    </th>
                                    {row.map((item, colIndex) => (
                                        <td key={colIndex} className="table-dark col-3 text-center" scope="col">
                                            {timeTables ? (zajecia.map((item) => (
                                                <div key={item._id} style={{
                                                    backgroundColor: item.classType.color,
                                                    color: 'black',
                                                    fontWeight: 'bold'
                                                }}>
                                                    { // @ts-ignore}
                                                    }{item.periodBlocks.includes(rowIndex + 1) && item.studentGroups.includes(colIndex + 1) && item.weekday == 5 ? (item.subject.name) : ("")}
                                                </div>
                                            ))) : <p>Loading...</p>}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {/*TABELA Sobotnia*/}
                        <table className="table table-striped table-hover table-bordered border-primary table-fixed-height">
                            <tbody>
                            <tr className="table-dark text-center">
                                <td className="table-dark text-center fw-bolder fs-5" colSpan={3}>
                                    Sobota
                                </td>

                            </tr>
                            <tr className="table-dark">
                                <th className='text-center'>Godzina</th>
                                {groupNumber > 0 ? (
                                    Array.from({length: groupNumber}, (_, i) => i + 1).map((num) => (
                                        <th key={num} className='text-center'> Grupa {num}</th>
                                    ))
                                ) : (
                                    <th>Error</th>
                                )}
                            </tr>
                            {grid.map((row, rowIndex) => (
                                <tr key={rowIndex} className="table-dark text-center h-100">
                                    <th scope="col" className='col-2'>
                                        {timeTables ? (timeTables[0].schedules[1].periods[rowIndex].startTime + " - " + timeTables[0].schedules[1].periods[rowIndex].endTime) : (
                                            <p>Loading...</p>)}
                                    </th>
                                    {row.map((item, colIndex) => (
                                        <td key={colIndex} className="table-dark col-3 text-center" scope="col">
                                            {timeTables ? (zajecia.map((item) => (
                                                <div key={item._id} style={{
                                                    backgroundColor: item.classType.color,
                                                    color: 'black',
                                                    fontWeight: 'bold'
                                                }}>
                                                    { // @ts-ignore}
                                                    }{item.periodBlocks.includes(rowIndex + 1) && item.studentGroups.includes(colIndex + 1) && item.weekday == 6 ? (item.subject.name) : ("")}
                                                </div>
                                            ))) : <p>Loading...</p>}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    {/*TABELA Niedzielna*/}
                    <table className="table table-striped table-hover table-bordered border-primary table-fixed-height">
                        <tbody>
                        <tr className="table-dark text-center">
                            <td className="table-dark text-center fw-bolder fs-5" colSpan={3}>
                                Niedziela
                            </td>

                        </tr>
                        <tr className="table-dark">
                            {groupNumber > 0 ? (
                                Array.from({length: groupNumber}, (_, i) => i + 1).map((num) => (
                                    <th key={num} className='text-center'> Grupa {num}</th>
                                ))
                            ) : (
                                <th>Error</th>
                            )}
                        </tr>
                        {grid.map((row, rowIndex) => (
                            <tr key={rowIndex} className="table-dark text-center">
                                {row.map((item, colIndex) => (
                                    <td key={colIndex} className="table-dark col-3 text-center" scope="col">
                                        {timeTables ? (zajecia.map((item) => (
                                            <div key={item._id} style={{
                                                backgroundColor: item.classType.color,
                                                color: 'black',
                                                fontWeight: 'bold'
                                            }}>
                                                { // @ts-ignore}
                                                }{item.periodBlocks.includes(rowIndex + 1) && item.studentGroups.includes(colIndex + 1) && item.weekday == 0 ? (item.subject.name) : ("")}
                                            </div>
                                        ))) : <p>Loading...</p>}
                                    </td>
                                ))}
                            </tr>
                        ))}
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
