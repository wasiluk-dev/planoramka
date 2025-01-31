import React, { JSX } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { CheckRounded } from '@mui/icons-material';

import PeriodBlock from './PeriodBlock.tsx';

import APIUtils from '../utils/APIUtils.ts';
import EDayOfTheWeek from '../../../backend/src/enums/EDayOfTheWeek.ts';
import {
    CoursePopulated,
    FacultyPopulated,
    SchedulePopulated,
    SemesterPopulated,
} from '../../services/DBTypes.ts';
import { RoomAvailability } from '../views/Rooms.tsx';

type RoomsTableProps = {
    setDialogData: React.Dispatch<React.SetStateAction<{ title: string; content: JSX.Element }>>;
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isUserOnMobile: boolean;
    courses: CoursePopulated[];
    semesters: SemesterPopulated[];
    faculty: FacultyPopulated;
    weekday: EDayOfTheWeek;
    weekdayPeriods: Record<number, SchedulePopulated['periods']>;
    roomsAvailability: RoomAvailability[];
};

const RoomsTable: React.FC<RoomsTableProps> = ({ setDialogData, setDialogOpen, courses, semesters, faculty, weekday, weekdayPeriods, roomsAvailability }) => {
    const rooms = faculty.buildings.flatMap(building =>
        building.rooms.map(room => ({ ...room }))
    );

    return (<>
        <TableContainer>
            <Table stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        { weekdayPeriods[weekday]?.map(period => (
                            <TableCell key={ period.order }>{ `${ period.startTime } – ${ period.endTime }` }</TableCell>
                        )) }
                    </TableRow>
                </TableHead>
                <TableBody>
                    { rooms.map(room => {
                        return <TableRow key={ room._id }>
                            <TableCell>{ room.roomNumber }</TableCell>
                            { roomsAvailability.find(avRoom => avRoom.room._id === room._id)?.availability[weekday].map((c, i) => {
                                if (c === true) return <TableCell key={ i }><CheckRounded sx={{ color: 'rgba(0, 0, 0, 0.26)' }}/></TableCell>;
                                const semester = semesters.find(s => s._id === c.semester?._id);
                                const course = c.semester ? APIUtils.getCourseFromSemesterId(courses, c.semester._id) : undefined;


                                return (<TableCell key={ i } sx={{ padding: '4px' }}>
                                    <PeriodBlock
                                        variant="titleOnly"
                                        setDialogData={ setDialogData }
                                        setDialogOpen={ setDialogOpen }
                                        classType={ c.classType }
                                        subject={ c.subject }
                                        organizer={ c.organizer }
                                        course={ course }
                                        semester={ semester }
                                    />
                                </TableCell>);
                            }) }
                        </TableRow>
                    }) }
                </TableBody>
            </Table>
        </TableContainer>
    </>);
};

export default RoomsTable;
