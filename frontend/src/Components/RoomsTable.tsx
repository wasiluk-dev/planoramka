import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow
} from '@mui/material';
import { CheckRounded, NotInterestedRounded } from '@mui/icons-material';

import EDayOfTheWeek from '../../../backend/src/enums/EDayOfTheWeek.ts';
import { FacultyPopulated, SchedulePopulated } from '../../services/databaseTypes.tsx';
import { RoomAvailability } from '../views/Rooms.tsx';
import i18n, { i18nPromise } from '../i18n';

const { t } = i18n;
await i18nPromise;

type RoomsTableProps = {
    faculty: FacultyPopulated;
    weekday: EDayOfTheWeek;
    weekdayPeriods: Record<number, SchedulePopulated['periods']>;
    roomsAvailability: RoomAvailability[];
};

const RoomsTable: React.FC<RoomsTableProps> = ({ faculty, weekday, weekdayPeriods, roomsAvailability }) => {
    // the faculty has no linked buildings
    if (faculty.buildings.length === 0) return;

    const allRooms = faculty.buildings.flatMap((building) =>
        building.rooms.map((room) => ({ ...room }))
    );

    // none of the buildings have any rooms linked
    if (allRooms.length === 0) return;

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(allRooms.length > 10 ? 10 : allRooms.length);

    const handlePageChange = (
        _e: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    }

    const handleRowsPerPageChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedRows =
        rowsPerPage > 0
            ? allRooms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : allRooms;

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - allRooms.length) : 0;

    return (<>
        <TableContainer>
            <Table stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        {/* TODO: replace first cell with a faculty select */}
                        <TableCell style={{ fontWeight: 'bold' }}>{ faculty.name }</TableCell>
                        { weekdayPeriods[weekday]?.map(p => (
                            <TableCell key={ p.order }>{ `${ p.startTime } – ${ p.endTime }` }</TableCell>
                        )) }
                    </TableRow>
                </TableHead>
                <TableBody>
                    { paginatedRows.map((room) => (
                        <TableRow key={ room._id }>
                            <TableCell>{ room.roomNumber }</TableCell>
                            { roomsAvailability
                                .find(({ room: avRoom }) => avRoom._id === room._id)
                                ?.availability[weekday].map((isAvailable: boolean, i: number) => (
                                <TableCell key={ i }>
                                    { isAvailable ? <CheckRounded style={{ visibility: 'hidden' }}/> : <NotInterestedRounded/> }
                                </TableCell>
                            )) }
                        </TableRow>
                    )) }
                    { emptyRows > 0 && (
                        // TODO: make height be dependant on the current rows height
                        <TableRow style={{ height: 37 * emptyRows }}>
                            <TableCell colSpan={ weekdayPeriods[weekday].length + 1 }/>
                        </TableRow>
                    ) }
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            count={ allRooms.length }
                            page={ page }
                            onPageChange={ handlePageChange }
                            rowsPerPage={ rowsPerPage }
                            rowsPerPageOptions={ [10, allRooms.length] }
                            onRowsPerPageChange={ handleRowsPerPageChange }
                            labelDisplayedRows={({ from, to, count }) =>
                                `${ from }-${ to } ${ t('table_pagination_of') } ${ count !== -1 ? count : `more than ${ to }`}`
                            }
                            labelRowsPerPage={ `${ t('table_pagination_rows_per_page') }:` }
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    </>);
};

export default RoomsTable;
