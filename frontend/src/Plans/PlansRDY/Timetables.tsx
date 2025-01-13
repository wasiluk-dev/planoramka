import React, { JSX, useEffect, useMemo, useState } from 'react';
import {
    Accordion, AccordionDetails, AccordionSummary, Box, Tab,
    Table, TableBody, TableCell, TableRow, Tabs,
    Typography,
} from '@mui/material';
import { ArrowDropDownRounded } from '@mui/icons-material';

import PeriodBlock from '../../Components/PeriodBlock.tsx';
import TimetableClasses from '../../Components/TimetableClasses.tsx';

import './planrdy.css';
import APIService from '../../../services/APIService.ts';
import ENavTabs from '../../enums/ENavTabs.ts';
import StringUtils from '../../utils/StringUtils.ts';
import {
    ClassPopulated,
    PeriodPopulated,
    TimetablePopulated
} from '../../../services/DBTypes.ts';
import i18n, { i18nPromise } from '../../i18n';

const { t } = i18n;
await i18nPromise;

type ReadyPlanProps = {
    setCurrentTabValue: React.Dispatch<React.SetStateAction<number | false>>;
    setDialogData: React.Dispatch<React.SetStateAction<{ title: string; content: JSX.Element }>>;
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setDocumentTitle: React.Dispatch<React.SetStateAction<string>>;
}

const Timetables: React.FC<ReadyPlanProps> = ({ setCurrentTabValue, setDialogData, setDialogOpen, setDocumentTitle }) => {
    const [periods, setPeriods] = useState<PeriodPopulated[]>([]);
    const [accordionExpanded, setAccordionExpanded] = useState<boolean>(true);
    const [accordionTitle, setAccordionTitle] = useState<string>(t('timetables_chooser'));

    const [selectedTimetable, setSelectedTimetable] = useState<TimetablePopulated | undefined>();
    const [selectedSemesterId, setSelectedSemesterId] = useState<string>('');
    const [semesterClasses, setSemesterClasses] = useState<ClassPopulated[]>([]);
    const [classTypes, setClassTypes] = useState<TimetablePopulated['groups']>([]);
    const [groupedClassTypes, setGroupedClassTypes] = useState<Record<number, string[]>>({});

    const [grid, setGrid] = useState<Array<Array<ClassPopulated | null>>>([]);
    const [weekday, setWeekday] = useState<number>(new Date().getDay());
    const [groupNumber, setGroupNumber] = useState<number>(0);
    const [groupNames, setGroupNames] = useState({});
    const [fixedRows, setFixedRows] = useState<number>(14);
    const [tableData, setTableData] = useState<Record<string, (null | any)[][]>>({});

    const normal = useMemo(() => {
        return periods?.filter(period => period.weekdays.includes(1))
            .sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
    }, [periods]);

    useEffect(() => {
        setDocumentTitle(t('nav_route_timetables'));
        setCurrentTabValue(ENavTabs.Timetables);

        const fetchData = async () => {
            const periodsPopulated = await APIService.getPeriods();
            setPeriods(periodsPopulated);
        };

        fetchData().then();
    }, []);
    useEffect(() => {
        if (semesterClasses.length > 0) {
            const allStudentGroups = semesterClasses.flatMap(item => item.studentGroups || []);
            const uniqueStudentGroups = new Set(allStudentGroups);
            setGroupNumber(uniqueStudentGroups.size);
        }
    }, [semesterClasses]);
    useEffect(() => {
        if (classTypes && classTypes.length > 0) { // Check if groupTypes is populated
            const names = classTypes.reduce((accumulator, current) => {
                const acronym = current.classType.acronym; // Get the acronym
                accumulator[acronym] = current.groupCount; // Set the acronym as key and count as value
                return accumulator; // Return the updated accumulator
            }, {} as Record<string, number>); // Initialize as an empty object with string keys and number values
            setGroupNames(names); // Update groupNames with the transformed data
            setGroupedClassTypes(classTypes.reduce((acc, group) => {
                const key = group.groupCount;
                if (!acc[key]) acc[key] = [];
                acc[key].push(group.classType.name);
                return acc;
            }, {} as Record<number, string[]>));
        }
    }, [classTypes, selectedSemesterId]);
    useEffect(() => {
        // update grid based on fixedRows and groupNumber
        const updatedGrid: Array<Array<ClassPopulated | null>> = Array.from({ length: fixedRows }, () => Array(groupNumber).fill(null));
        setGrid(updatedGrid);
    }, [fixedRows, groupNumber, selectedSemesterId]);
    useEffect(() => {
        // Check if `normal` is defined and has a valid length
        if (!normal || normal.length === 0) return;

        const updatedGrid: Array<Array<ClassPopulated | null>> = Array(fixedRows)
            .fill(null)
            .map(() => Array(groupNumber).fill(" "));
        setGrid(updatedGrid);
    }, [groupNumber, normal, selectedSemesterId]);
    useEffect(() => {
        // Update tableData whenever input changes
        if (classTypes && classTypes.length > 0) {
            const newTableData = classTypes.reduce((acc, group) => {
                acc[group.classType.acronym] = Array.from({ length: fixedRows }, () =>
                    Array(group.groupCount).fill(null)
                );

                return acc;
            }, {} as Record<string, (null | any)[][]>);
            setGroupedClassTypes(classTypes.reduce((acc, group) => {
                const key = group.groupCount;
                if (!acc[key]) acc[key] = [];

                acc[key].push(group.classType.name);
                return acc;
            }, {} as Record<number, string[]>));
            setTableData(newTableData);
        }
    }, [fixedRows, classTypes, selectedSemesterId, weekday]);
    useEffect(() => {
        const filteredClasses = semesterClasses.filter(
            classItem => classItem.weekday === weekday
        );

        setTableData(prevTableData => {
            const newTableData = { ...prevTableData };

            filteredClasses.forEach(classItem => {
                const { acronym } = classItem.classType;
                const groups = classItem.studentGroups || [];

                if (newTableData[acronym]) {
                    classItem.periodBlocks.forEach(period => {
                        if (period <= fixedRows) {
                            groups.forEach(groupIdx => {
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
    }, [fixedRows, selectedSemesterId, semesterClasses, weekday, setTableData]);
    useEffect(() => {
        if (semesterClasses.length > 0) {
            const filteredClasses = semesterClasses.filter(
                (classItem) => classItem.weekday === weekday
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

        updateTableData();
    }, [fixedRows, groupNames, selectedSemesterId, semesterClasses, weekday]);

    const handleAccordionChange = () => {
        if (!accordionExpanded) {
            setAccordionTitle(t('timetables_chooser'))
        } else {
            // const professor = professors.find(p => p._id === selectedProfessorId);
            setAccordionTitle(t('timetables_chooser'));
        }

        setAccordionExpanded(!accordionExpanded);
    };
    const handleWeekdayChange = (_e: React.SyntheticEvent, newWeekday: number) => {
        setWeekday(newWeekday);
        if (selectedTimetable) {
            const schedule = selectedTimetable.schedules.find(schedule => schedule.weekdays.includes(newWeekday));
            if (schedule) {
                setFixedRows(schedule.periods.length);
            }

            updateTableData();
        }
    };
    const updateTableData = () => {
        if (semesterClasses.length > 0) {
            const filteredClasses = semesterClasses.filter(
                classItem => classItem.weekday === weekday
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

    return (<>
        <Accordion expanded={ accordionExpanded } onChange={ handleAccordionChange }>
            <AccordionSummary expandIcon={ <ArrowDropDownRounded/> }>
                <Typography>{ accordionTitle }</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <TimetableClasses
                    setAccordionExpanded={ setAccordionExpanded }
                    states={{
                        timetable: {
                            value: selectedTimetable,
                            set: setSelectedTimetable,
                        },
                        semesterId: {
                            value: selectedSemesterId,
                            set: setSelectedSemesterId,
                        },
                        semesterClasses: {
                            value: semesterClasses,
                            set: setSemesterClasses,
                        },
                        groupTypes: {
                            value: classTypes,
                            set: setClassTypes,
                        },
                    }}
                />
            </AccordionDetails>
        </Accordion>

        { selectedTimetable && (<>
            <Tabs variant="fullWidth" value={ weekday } onChange={ handleWeekdayChange }>
                { Object.entries(StringUtils.day)
                    .filter(([k]) => k !== '0')
                    .map(([k, v]) =>
                        <Tab label={ v } key={ parseInt(k) } value={ parseInt(k) }/>
                    )
                }
                <Tab value={ 0 } label={ StringUtils.day['0'] }></Tab>
            </Tabs>

            <Table
                className="table-bordered"
                sx={{ '& td, & th': { minHeight: 60 } }}
            >
                <TableBody style={{ height: '100%' }}>
                    <TableRow className="table-dark godzina">
                        <TableCell rowSpan={ classTypes ? classTypes.length - 2 : undefined }>
                            <Typography sx={{ fontWeight: 'bold' }}>Godzina</Typography>
                        </TableCell>
                    </TableRow>

                    { classTypes ? (
                        // classTypes.map(group => (
                        //     <TableRow key={ group.classType._id } className="table-dark d-flex flex-row">
                        //         { Array.from({ length: group.groupCount }).map((_, i) => (
                        //             <TableCell key={ i }
                        //                 className="text-center w-100 border-secondary border border-1 grupy">
                        //                 {group.classType.name} {i + 1}
                        //             </TableCell>
                        //
                        //         )) }
                        //     </TableRow>
                        // ))
                        Object.entries(groupedClassTypes).map(([groupCount, classNames]) =>
                            <TableRow key={ groupCount } className="table-dark d-flex flex-row">
                                { Array.from({ length: Number(groupCount) }).map((_, i) => (
                                    <TableCell key={ i } sx={{ width: '100%' }}>
                                        <Typography sx={{ fontWeight: 'bold' }}>{ classNames.join(' / ') } { i + 1 }</Typography>
                                    </TableCell>
                                )) }
                            </TableRow>
                        )
                    ) : (
                        <TableRow>
                            <TableCell>Error</TableCell>
                        </TableRow>
                    ) }


                { grid.map((_row, rowIndex) => {
                    return (
                        // TODO: check why minHeight is not working
                        <TableRow
                            key={ rowIndex }
                            sx={{ minHeight: 60 }}
                            className="table-dark text-center">
                            {/* Time column */}
                            <TableCell sx={{ padding: 0, pt: 2, pb: 2 }} scope="col">
                                { selectedTimetable ? (
                                    (weekday === 0 || weekday === 6) && selectedTimetable.schedules[1]?.periods[rowIndex] ? (
                                        selectedTimetable.schedules[1].periods[rowIndex].startTime + ' – ' + selectedTimetable.schedules[1].periods[rowIndex].endTime
                                    ) : (weekday > 0 && weekday < 6 && selectedTimetable.schedules[0]?.periods[rowIndex] ? (
                                        selectedTimetable.schedules[0].periods[rowIndex].startTime + ' – ' + selectedTimetable.schedules[0].periods[rowIndex].endTime
                                    ) : ("Error in showing period per day!"))
                                ) : (
                                    <p>Loading...</p>
                                ) }
                            </TableCell>

                            {/* Rowspan column */}
                            { rowIndex === 0 && (
                                <TableCell
                                    colSpan={ 2 }
                                    rowSpan={ grid.length }
                                    className="align-middle table-in p-0"
                                >
                                    <Box sx={{ p: 0, display: 'grid' }}>
                                        { Object.keys(tableData || {}).map(acronym => {
                                            let hasData: boolean = false;
                                            Object.values(tableData[acronym]).map(array =>
                                                Object.values(array).map(item => {
                                                    if (item !== null) {
                                                        hasData = true;
                                                        return;
                                                    }
                                                })
                                            );

                                            // skip empty groups
                                            if (!hasData) return;

                                            return (
                                                <Table
                                                    key={ acronym }
                                                    sx={{ height: '100%', '& td, & th': { minHeight: 60 } }}
                                                    className="table-bordered table-dark table-fixed-height table-equal-rows bg-transparent table-combo-child"
                                                >
                                                    <TableBody>
                                                    { Array.isArray(tableData[acronym]) &&
                                                        tableData[acronym].map((row, rowIndex) => (
                                                            Array.isArray(row) && (
                                                                <TableRow key={ rowIndex }>
                                                                    { (() => {
                                                                        const mergedCells: JSX.Element[] = [];
                                                                        let colSpan: number = 1;

                                                                        for (let colIndex: number = 0; colIndex < row.length; colIndex++) {
                                                                            const currentCell = row[colIndex];
                                                                            const nextCell = row[colIndex + 1];

                                                                            // If current cell and next cell are identical, increase colSpan
                                                                            if (
                                                                                currentCell
                                                                                && nextCell
                                                                                && JSON.stringify(currentCell) === JSON.stringify(nextCell)
                                                                            ) {
                                                                                colSpan++; // Increment colspan for consecutive identical cells
                                                                            } else {
                                                                                // Render the current cell with the correct colSpan
                                                                                mergedCells.push(
                                                                                    <TableCell
                                                                                        key={colIndex}
                                                                                        colSpan={colSpan}
                                                                                        className="bg-transparent p-0 col-1"
                                                                                    >
                                                                                        { currentCell ? (
                                                                                            <PeriodBlock
                                                                                                variant="big"
                                                                                                setDialogData={ setDialogData }
                                                                                                setDialogOpen={ setDialogOpen }
                                                                                                classType={currentCell.classType}
                                                                                                organizer={currentCell.organizer}
                                                                                                room={currentCell.room}
                                                                                                subject={currentCell.subject}
                                                                                            />
                                                                                        ) : (
                                                                                            // empty cell placeholder
                                                                                            <span className="text-black fw-bolder"></span>
                                                                                        ) }
                                                                                    </TableCell>
                                                                                );

                                                                                // reset colspan for the next group
                                                                                colSpan = 1;
                                                                            }
                                                                        }

                                                                        return mergedCells;
                                                                    })() }
                                                                </TableRow>
                                                            )
                                                        )) }
                                                    </TableBody>
                                                </Table>
                                            );
                                        }) }
                                    </Box>

                                </TableCell>
                            )}
                        </TableRow>
                    );
                }) }
                </TableBody>
            </Table>
        </>) }
    </>);
};

export default Timetables;

// TODO: ogarnąć divy żeby były na całość i nie było ich 213769; Godziny zależne do dnia;