import React, { JSX } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { CheckRounded } from '@mui/icons-material';

import APIUtils from '../utils/APIUtils.ts';
import EDayOfTheWeek from '../../../backend/src/enums/EDayOfTheWeek.ts';
import PeriodBlock from './PeriodBlock.tsx';
import {
    CoursePopulated,
    FacultyPopulated,
    SchedulePopulated,
    SemesterPopulated,
} from '../../services/DBTypes.ts';
import { RoomAvailability } from '../views/Rooms.tsx';
// import i18n, { i18nPromise } from '../i18n';
//
// const { t } = i18n;
// await i18nPromise;

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

const RoomsTable: React.FC<RoomsTableProps> = ({ setDialogData, setDialogOpen, isUserOnMobile, courses, semesters, faculty, weekday, weekdayPeriods, roomsAvailability }) => {
    const allRooms = faculty.buildings.flatMap((building) =>
        building.rooms.map((room) => ({ ...room }))
    );

    // const [page, setPage] = useState<number>(0);
    // const [rowsPerPage, setRowsPerPage] = useState<number>(allRooms.length > 10 ? 10 : allRooms.length);
    //
    // const handlePageChange = (
    //     _e: React.MouseEvent<HTMLButtonElement> | null,
    //     newPage: number,
    // ) => {
    //     setPage(newPage);
    // }
    //
    // const handleRowsPerPageChange = (
    //     event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    // ) => {
    //     setRowsPerPage(parseInt(event.target.value, 10));
    //     setPage(0);
    // };
    //
    // const paginatedRows =
    //     rowsPerPage > 0
    //         ? allRooms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    //         : allRooms;
    //
    // const emptyRows =
    //     page > 0 ? Math.max(0, (1 + page) * rowsPerPage - allRooms.length) : 0;

    return (<>
        <TableContainer sx={{  }}>
            <Table stickyHeader size="small" sx={{  }}>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        { weekdayPeriods[weekday]?.map(period => (
                            <TableCell key={ period.order }>{ `${ period.startTime } – ${ period.endTime }` }</TableCell>
                        )) }
                    </TableRow>
                </TableHead>
                <TableBody>
                    { allRooms.map(room => {
                        return <TableRow key={ room._id }>
                            <TableCell>{ room.roomNumber }</TableCell>
                            { roomsAvailability.find(avRoom => avRoom.room._id === room._id)?.availability[weekday].map((c, i) => {
                                if (c === true) return <TableCell key={ i }><CheckRounded sx={{ color: 'rgba(0, 0, 0, 0.26)' }}/></TableCell>;
                                const semester = semesters.find(s => s._id === c.semester);
                                const course = c.semester ? APIUtils.getCourseFromSemesterId(courses, c.semester) : undefined;


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
                    {/*{ emptyRows > 0 && (*/}
                    {/*    // TODO: make height be dependant on the current rows height*/}
                    {/*    <TableRow style={{ height: 37 * emptyRows }}>*/}
                    {/*        <TableCell colSpan={ weekdayPeriods[weekday].length + 1 }/>*/}
                    {/*    </TableRow>*/}
                    {/*) }*/}
                </TableBody>
                {/*<TableFooter>*/}
                {/*    <TableRow>*/}
                {/*        <TablePagination*/}
                {/*            count={ allRooms.length }*/}
                {/*            page={ page }*/}
                {/*            onPageChange={ handlePageChange }*/}
                {/*            rowsPerPage={ rowsPerPage }*/}
                {/*            rowsPerPageOptions={ [10, allRooms.length] }*/}
                {/*            onRowsPerPageChange={ handleRowsPerPageChange }*/}
                {/*            labelDisplayedRows={({ from, to, count }) =>*/}
                {/*                `${ from }-${ to } ${ t('table_pagination_of') } ${ count !== -1 ? count : `more than ${ to }`}`*/}
                {/*            }*/}
                {/*            labelRowsPerPage={ `${ t('table_pagination_rows_per_page') }:` }*/}
                {/*        />*/}
                {/*    </TableRow>*/}
                {/*</TableFooter>*/}
            </Table>
        </TableContainer>
    </>);
};

export default RoomsTable;
