import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Tab, Tabs } from '@mui/material';

import RoomsTable from '../Components/RoomsTable.tsx';
import APIService from '../../services/apiService.tsx';
import APIUtils from '../utils/APIUtils.ts';
import StringUtils from '../utils/StringUtils.ts';
import EDayOfTheWeek from '../../../backend/src/enums/EDayOfTheWeek.ts';
import ENavTabs from '../enums/ENavTabs.ts';
import { ClassPopulated, FacultyPopulated, RoomPopulated, SchedulePopulated, } from '../../services/databaseTypes.tsx';
import i18n, { i18nPromise } from '../i18n';

const { t } = i18n;
await i18nPromise;

export type RoomAvailability = {
    room: RoomPopulated;
    availability: Record<number, boolean[]>;
}

type RoomsProps = {
    setDocumentTitle: React.Dispatch<React.SetStateAction<string>>;
    setCurrentTabValue: React.Dispatch<React.SetStateAction<number | boolean>>;
}

const Rooms: React.FC<RoomsProps> = ({ setDocumentTitle, setCurrentTabValue }) => {
    const [classes, setClasses] = useState<ClassPopulated[]>([]);
    const [faculties, setFaculties] = useState<FacultyPopulated[]>([]);
    const [rooms, setRooms] = useState<RoomPopulated[]>([]);
    const [schedules, setSchedules] = useState<SchedulePopulated[]>([]);
    const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

    const [weekday, setWeekday] = useState<EDayOfTheWeek>(new Date().getDay());
    const [weekdayPeriods, setWeekdayPeriods] = useState<Record<number, SchedulePopulated['periods']>>({});
    const [roomsAvailability, setRoomsAvailability] = useState<RoomAvailability[]>([]);

    useEffect(() => {
        setDocumentTitle(t('nav_route_rooms'));
        setCurrentTabValue(ENavTabs.Rooms);

        const fetchData = async() => {
            setClasses(await APIService.getClasses());
            setFaculties(await APIService.getFaculties());
            setRooms(await APIService.getRooms());
            setSchedules(await APIService.getSchedules());
        }

        fetchData().then(() => setIsDataLoaded(true));
    }, []);
    useEffect(() => {
        const weekdayPeriods: Record<number, SchedulePopulated['periods']> = {};
        for (const s of schedules) {
            for (let i = 0; i < 7; i++) {
                if (s.weekdays.includes(i)) {
                    weekdayPeriods[i] = (s.periods);
                }
            }
        }
        setWeekdayPeriods(weekdayPeriods);

        const roomsAvailabilityToSet: RoomAvailability[] = [];
        for (const r of rooms) {
            roomsAvailabilityToSet.push({
                room: r,
                availability: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
            });
        }

        for (const ra of roomsAvailabilityToSet) {
            for (let i = 0; i < 7; i++) {
                let roomAvailability = roomsAvailabilityToSet.find((a) =>
                    a.room._id === ra.room._id
                );

                if (roomAvailability) {
                    for (let j = 0; j < weekdayPeriods[i].length; j++) {
                        roomAvailability.availability[i].push(!APIUtils.isRoomOccupied(classes, ra.room._id, i, j));
                    }
                }
            }
        }

        setRoomsAvailability(roomsAvailabilityToSet);
    }, [schedules]);

    const handleWeekdayChange = (_e: React.SyntheticEvent, v: number) => {
        setWeekday(v);
    }

    return (<>
        { !isDataLoaded && (
            <Box style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <CircularProgress/>
            </Box>
        ) }
        { faculties.length === 0 ? (<>
            <div>{ t('rooms_error_faculties_missing_title') }</div>
            <p>{ t('rooms_error_faculties_missing_message') }</p>
        </>) : (<>
            <Tabs variant="scrollable"
                  scrollButtons="auto"
                  value={ weekday }
                  onChange={ handleWeekdayChange }
            >
                { Object.entries(StringUtils.day).map(([k, v]) => {
                    if (k !== "0") {
                        return (
                            <Tab key={ parseInt(k) }
                                 value={ parseInt(k) }
                                 label={ v }></Tab>
                        );
                    }
                }) }
                <Tab value={ 0 } label={ StringUtils.day["0"] }></Tab>
            </Tabs>
            {
                faculties.map((faculty) => {
                    // the faculty has no linked buildings
                    if (faculty.buildings.length === 0) return;

                    let roomCount = 0;
                    faculty.buildings.map((building) => {
                        building.rooms.map(() => {
                            roomCount++;
                        })
                    })

                    // none of the buildings have any rooms linked
                    if (roomCount === 0) return;

                    return (
                        <RoomsTable key={ faculty._id }
                                    faculty={ faculty }
                                    weekday={ weekday }
                                    weekdayPeriods={ weekdayPeriods }
                                    roomsAvailability={ roomsAvailability }/>
                    );
                })
            }
        </>) }
    </>);
};

export default Rooms;
