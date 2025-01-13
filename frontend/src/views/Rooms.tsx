import React, { JSX, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import {
    Accordion, AccordionDetails, AccordionSummary,
    FormControl,
    InputLabel,
    MenuItem,
    Select, SelectChangeEvent,
    Stack,
    Tab, Tabs,
    Typography,
} from '@mui/material';
import { ArrowDropDownRounded } from '@mui/icons-material';

import RoomsTable from '../Components/RoomsTable.tsx';

import APIService from '../../services/APIService.ts';
import APIUtils from '../utils/APIUtils.ts';
import StringUtils from '../utils/StringUtils.ts';
import EDayOfTheWeek from '../../../backend/src/enums/EDayOfTheWeek.ts';
import ENavTabs from '../enums/ENavTabs.ts';
import {
    ClassPopulated,
    CoursePopulated,
    FacultyPopulated,
    RoomPopulated,
    SchedulePopulated,
    SemesterPopulated,
} from '../../services/DBTypes.ts';
import i18n, { i18nPromise } from '../i18n';

const { t } = i18n;
await i18nPromise;

export type RoomAvailability = {
    room: RoomPopulated;
    availability: Record<number, (ClassPopulated | true)[]>;
}
type RoomsProps = {
    isUserOnMobile: boolean;
    setCurrentTabValue: React.Dispatch<React.SetStateAction<number | false>>;
    setDialogData: React.Dispatch<React.SetStateAction<{ title: string; content: JSX.Element }>>;
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setDocumentTitle: React.Dispatch<React.SetStateAction<string>>;
}

const Rooms: React.FC<RoomsProps> = ({ isUserOnMobile, setCurrentTabValue, setDialogData, setDialogOpen, setDocumentTitle }) => {
    const [, setCookie] = useCookies();

    const [accordionTitle, setAccordionTitle] = useState<string>('');
    const [accordionExpanded, setAccordionExpanded] = useState<boolean>(true);

    const [classes, setClasses] = useState<ClassPopulated[]>([]);
    const [courses, setCourses] = useState<CoursePopulated[]>([]);
    const [faculties, setFaculties] = useState<FacultyPopulated[]>([]);
    const [rooms, setRooms] = useState<RoomPopulated[]>([]);
    const [semesters, setSemesters] = useState<SemesterPopulated[]>([]);
    const [schedules, setSchedules] = useState<SchedulePopulated[]>([]);
    const [, setDataLoaded] = useState<boolean>(false);

    const [selectedFaculty, setSelectedFaculty] = useState<FacultyPopulated | undefined>();
    const [selectedFacultyId, setSelectedFacultyId] = useState<string>('');
    const [weekday, setWeekday] = useState<EDayOfTheWeek>(new Date().getDay());
    const [weekdayPeriods, setWeekdayPeriods] = useState<Record<number, SchedulePopulated['periods']>>({});
    const [roomsAvailability, setRoomsAvailability] = useState<RoomAvailability[]>([]);

    useEffect(() => {
        setDocumentTitle(t('nav_route_rooms'));
        setCurrentTabValue(ENavTabs.Rooms);

        const fetchData = async() => {
            setClasses(await APIService.getClasses());
            setCourses(await APIService.getCourses());
            setFaculties(await APIService.getFaculties());
            setRooms(await APIService.getRooms());
            setSemesters(await APIService.getSemesters());
            setSchedules(await APIService.getSchedules());
        }

        fetchData().then(() => {
            // TODO: fix loading faculty from cookies
            // setSelectedFaculty(cookies['rooms.faculty'] ?? undefined);
            // setSelectedFacultyId(cookies['rooms.facultyId'] ?? '');
            // setAccordionTitle(t('rooms_schedule') + (selectedFaculty ? ` – ${ selectedFaculty.name }` : ''));
            // setAccordionExpanded(!accordionExpanded);
            setDataLoaded(true);
        });
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
                        if (APIUtils.isRoomOccupied(classes, ra.room._id, i, j)) {
                            const roomsClass = APIUtils.getRoomsClass(classes, ra.room._id, i, j);
                            if (roomsClass) roomAvailability.availability[i].push(roomsClass);
                        } else {
                            roomAvailability.availability[i].push(true);
                        }
                    }
                }
            }
        }

        roomsAvailabilityToSet.sort((a, b) => a.room._id.localeCompare(b.room._id));
        setRoomsAvailability(roomsAvailabilityToSet);
    }, [schedules]);

    const handleWeekdayChange = (_e: React.SyntheticEvent, v: number) => {
        setWeekday(v);
    }
    const handleAccordionChange = () => {
        if (!accordionExpanded) {
            setAccordionTitle(t('rooms_schedule'));
        } else {
            setAccordionTitle(t('rooms_schedule') + (selectedFaculty ? ` – ${ selectedFaculty.name }` : ''));
        }

        setAccordionExpanded(!accordionExpanded);
    };
    const handleSelectedFacultyChange = (event: SelectChangeEvent) => {
        const facultyId = event.target.value;
        const faculty = faculties.find(f => f._id === facultyId);

        setCookie('rooms.faculty', faculty);
        setCookie('rooms.facultyId', facultyId);
        setSelectedFacultyId(facultyId);
        setSelectedFaculty(faculty);
        setAccordionTitle(t('rooms_schedule') + (faculty ? ` – ${ faculty.name }` : ''));
        setAccordionExpanded(!accordionExpanded);
    }
    const doesFacultyHaveRooms = (faculty: FacultyPopulated) => {
        // the faculty has no linked buildings
        if (faculty.buildings.length === 0) return false;

        let roomCount = 0;
        faculty.buildings.map((building) => {
            building.rooms.map(() => {
                roomCount++;
            })
        })

        return roomCount !== 0;
    }

    return (
        <Stack sx={{ height: '100%' }}>
            {/*{ !dataLoaded && (*/}
            {/*    <Box style={{*/}
            {/*        display: 'flex',*/}
            {/*        flexDirection: 'column',*/}
            {/*        minHeight: '100vh',*/}
            {/*        alignItems: 'center',*/}
            {/*        justifyContent: 'center',*/}
            {/*    }}>*/}
            {/*        <CircularProgress/>*/}
            {/*    </Box>*/}
            {/*) }*/}
            <Accordion expanded={ accordionExpanded } onChange={ handleAccordionChange }>
                <AccordionSummary expandIcon={ <ArrowDropDownRounded/> }>
                    <Typography>{ accordionTitle ? accordionTitle : t('rooms_schedule') }</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack>
                        <FormControl>
                            <InputLabel>{ t('rooms_faculty') }</InputLabel>
                            <Select
                                label={ t('rooms_faculty') }
                                value={ selectedFacultyId }
                                onChange={ handleSelectedFacultyChange }
                            >
                                { faculties.map(faculty => (
                                    <MenuItem
                                        key={ faculty._id }
                                        value={ faculty._id }
                                        disabled={ !doesFacultyHaveRooms(faculty) }
                                    >
                                        { faculty.name }
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </AccordionDetails>
            </Accordion>
            { selectedFaculty && (<>
                <Tabs
                    sx={{  }}
                    variant="fullWidth"
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
                <RoomsTable
                    setDialogData={ setDialogData }
                    setDialogOpen={ setDialogOpen }
                    isUserOnMobile={ isUserOnMobile }
                    courses={ courses }
                    semesters={ semesters }
                    faculty={ selectedFaculty }
                    weekday={ weekday }
                    weekdayPeriods={ weekdayPeriods }
                    roomsAvailability={ roomsAvailability }
                />
            </>) }
        </Stack>
    );
};

export default Rooms;
