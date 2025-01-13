import React, { useEffect, useState } from 'react';
import {
    Autocomplete,
    Button,
    Checkbox,
    FormControlLabel,
    MenuItem, Select, SelectChangeEvent,
    TextField,
} from '@mui/material';

import SearchableDropdown from '../SearchableDropdown/SearchableDropdown.tsx';

import './Popup.css';
import APIService from '../../../services/APIService.ts';
import APIUtils from '../../utils/APIUtils.ts';
import EUserRole from '../../../../backend/src/enums/EUserRole.ts';
import EWeekday from '../../enums/EWeekday.ts';
import { ClassPopulated, FacultyPopulated, RoomPopulated, UserPopulated } from '../../../services/DBTypes.ts';
import i18n, { i18nPromise } from '../../i18n';

const { t } = i18n;
await i18nPromise;

type SubjectPopup = {
    color: string;
    groups: number;
    id: string;
    isset: boolean;
    isweekly: boolean;
    name: string;
    room: string;
    setday: number;
    teacher: string;
    type: string;
    weeklyCount: number;
    x: number;
    y: number;
}

type RoomPopupProps = {
    trigger: boolean;
    setTrigger: (trigger: boolean) => void;
    pickedFaculty?: FacultyPopulated;
    subject?: SubjectPopup;
    onSubjectChange?: (updatedSubject: SubjectPopup) => void;
}

const RoomPopup: React.FC<RoomPopupProps> = (props: RoomPopupProps) => {
    const [faculties, setFaculties] = useState<FacultyPopulated[]>([]);
    const [professors, setProfessors] = useState<UserPopulated[]>([]);
    const [users, setUsers] = useState<UserPopulated[]>([]);

    const [roomValue, setRoomValue] = useState<string>('');
    const [newRooms, setNewRooms] = useState<RoomPopulated[]>([]);
    const [classes, setClasses] = useState<Array<ClassPopulated>>([]);
    const [allTeachers, setAllTeachers] = useState<UserPopulated[]>([]);
    const [showOnlyFreeTeachers, setShowOnlyFreeTeachers] = useState<boolean>(false);
    const [showOnlyFreeRooms, setShowOnlyFreeRooms] = useState<boolean>(false);
    const [showAllRooms, setShowAllRooms] = useState<boolean>(false);
    const [rooms, setRooms] = useState<RoomPopulated[]>([]);
    const [selectedFacultyId, setSelectedFacultyId] = useState<string>('');
    const [selectedFacultyBuildings, setSelectedFacultyBuildings] = useState<Omit<FacultyPopulated, 'courses'>>();
    const [roomsList, setRoomsList] = useState<Pick<RoomPopulated, '_id' | 'roomNumber'>[]>([]);
    const [buildingName, setBuildingName] = useState<string>('');
    const [localSubject, setLocalSubject] = useState<SubjectPopup | undefined>(props.subject);

    const [teacherValue, setTeacherValue] = useState<string>('');
    const [teacherList, setTeacherList] = useState<Pick<UserPopulated, '_id' | 'names' | 'surnames'>[]>([]);
    const [teacherSurnameList, setTeacherSurnameList] = useState<Pick<UserPopulated, '_id' | 'names' | 'surnames'>[]>([]);

    const [selectedProfessor, setSelectedProfessor] = useState<UserPopulated | null>(null);

    useEffect(() => {
        const fetchData = async() => {
            const usersPopulated = await APIService.getUsers();

            setFaculties(await APIService.getFaculties());
            setProfessors(APIUtils.getUsersWithRole(usersPopulated, EUserRole.Professor));
            setUsers(usersPopulated);
        }

        fetchData().then();
    }, []);
    useEffect(() => {
        setLocalSubject(props.subject); // Sync with incoming prop when `props.subject` changes
    }, [props.subject]);
    useEffect(() => {
        const fetchData = async() => setClasses(await APIService.getClasses());
        fetchData();
    }, [props.trigger]);
    useEffect(() => {
        if (props.trigger) {
            const fetchData = async () => {
                const allTeachers = APIUtils.getUsersWithRole(users, EUserRole.Professor);
                const teachersSorted = allTeachers.sort((a, b) =>
                    a.surnames.localeCompare(b.surnames, 'pl')
                );

                const modifiedNames = allTeachers.map(teacher => {
                    let isBusy: boolean = false
                    if (props.subject && localSubject){
                        isBusy = APIUtils.isProfessorBusy(classes, teacher._id, props.subject?.setday, localSubject?.x + 1);
                    }
                    const surnames = teacher.surnames;
                    const names = teacher.names;
                    if (isBusy) {
                        return {
                            _id: teacher._id,
                            names: teacher.names,
                            surnames: teacher.surnames + " (zajęty/a)",
                            fullName: `${surnames} ${names}`,
                        };
                    }else {
                        return {
                            _id: teacher._id,
                            names: teacher.names,
                            surnames: teacher.surnames,
                            fullName: `${surnames} ${names}`,
                        };
                    }
                });

                setTeacherSurnameList(modifiedNames);
                setAllTeachers(teachersSorted);
            };

            fetchData().then();
        }
    }, [localSubject]);
    useEffect(() => {
        if (props.pickedFaculty?.buildings && props.pickedFaculty.buildings.length > 0) {
            const allRooms = props.pickedFaculty.buildings.flatMap(building => building.rooms || []);
            setRooms(allRooms);
        }
    }, [showAllRooms, props.trigger]);
    useEffect(() => {
        setTeacherList(teacherSurnameList.map(teacher => ({
            _id: teacher._id,
            fullName: teacher.names + ' ' + teacher.surnames,
        })))
    }, [teacherSurnameList, props.trigger]);
    useEffect(() => {
        setRoomsList(
            rooms.map(room => {
                const isOccupied = APIUtils.isRoomOccupied(classes, room._id, localSubject?.setday, localSubject?.x + 1);
                return {
                    _id: room._id,
                    roomNumber: isOccupied ? `${room.roomNumber} (zajęta)` : room.roomNumber,
                };
            })
        );
    }, [rooms, newRooms, !showAllRooms]);
    useEffect(() => {
        if (!props.subject && props.trigger) {
            console.error("Problem z przekazaniem obiektu zajęcia")
        } else if (props.trigger) {
            if (props.subject?.teacher) {
                const selectTeacher = teacherList.filter(teacher => teacher._id === props.subject?.teacher)
                if (selectTeacher.length === 0) {
                    setTeacherValue('')
                } else {
                    setTeacherValue(selectTeacher[0].name);
                }
            }

            if (props.subject?.room) {
                const selectRoom = rooms.filter((room) => room._id === props.subject?.room)
                if (localSubject){
                    if (APIUtils.isRoomOccupied(classes, selectRoom[0]._id,localSubject?.setday, localSubject?.x + 1)){
                        setRoomValue(selectRoom[0].roomNumber + " (ZAJĘTA)")
                    } else {
                        setRoomValue(selectRoom[0].roomNumber)
                    }
                }
            }
        }
    }, [teacherList, roomsList]);

    const handleFacultyChange = (event: SelectChangeEvent) => {
        const selectedValue = event.target.value;
        setBuildingName('');
        setSelectedFacultyId(selectedValue);
        setSelectedFacultyBuildings(faculties.find(
            faculty => faculty._id === selectedValue
        ));
    };
    const handleBuildingChange = (event: SelectChangeEvent) => {
        const selectedValue = event.target.value;
        if (selectedFacultyBuildings) {
            setNewRooms(selectedFacultyBuildings.buildings[Number(selectedValue)].rooms);
            setBuildingName(selectedValue);
        }
    };

    useEffect(() => {
        if (showOnlyFreeRooms && props.trigger){
            if (localSubject && classes.length > 0) {
                const freeRooms = APIUtils.getUnoccupiedRooms(classes, rooms, localSubject?.setday, localSubject?.x + 1)
                const setroom = freeRooms.find(room => room.roomNumber === roomValue);
                // TODO: fix
                if (!setroom) { //nwm czemu to nie działa, ale trudno
                    setRoomValue('');
                }

                setRoomsList(freeRooms);
            }
        } else if (!showOnlyFreeRooms && props.trigger) {
            const selectRoom = rooms.filter(room => room._id === props.subject?.room);

            if (localSubject) {
                if (APIUtils.isRoomOccupied(classes, selectRoom[0]._id,localSubject?.setday, localSubject?.x + 1)) {
                    setRoomValue(selectRoom[0].roomNumber + ' (zajęta)');
                } else {
                    setRoomValue(selectRoom[0].roomNumber);
                }

                setRoomsList(
                    rooms.map(room => {
                        const isOccupied = APIUtils.isRoomOccupied(
                            classes,
                            room._id,
                            localSubject.setday as EWeekday,
                            localSubject.x + 1
                        );

                        return {
                            _id: room._id,
                            roomNumber: isOccupied ? `${ room.roomNumber } (zajęta)` : room.roomNumber,
                        };
                    })
                );
            }
        }
    }, [showOnlyFreeRooms]);

    useEffect(() => {
        if (showOnlyFreeTeachers && props.trigger){
            if (localSubject && allTeachers.length > 0){
                const freeProfessors = APIUtils.getFreeProfessors(allTeachers, classes, localSubject?.setday, localSubject?.x + 1)
                const modifiedNames = freeProfessors.map(teacher => {
                    const surnames = teacher.surnames;
                    const names = teacher.names;
                    return {
                        _id: teacher._id,
                        names: teacher.names,
                        surnames: teacher.surnames,
                        fullName: `${surnames} ${names}`,
                    };
                });

                setTeacherSurnameList(modifiedNames);
            }

        } else if (!showOnlyFreeTeachers && props.trigger) {
            const modifiedNames = allTeachers.map(teacher => {
                let isBusy: boolean = false;
                if (props.subject && localSubject) {
                    isBusy = APIUtils.isProfessorBusy(classes, teacher._id, props.subject?.setday, localSubject?.x + 1);
                }

                const names = teacher.names;
                const surnames = teacher.surnames;
                return {
                    _id: teacher._id,
                    names: teacher.names,
                    surnames: teacher.surnames + (isBusy ? ' (ZAJĘTY/A)' : ''),
                    fullName: `${ surnames } ${ names }`,
                };
            });

            setTeacherSurnameList(modifiedNames);
        }
    }, [showOnlyFreeTeachers, props.trigger]);

    const handleRoomChange = (val: { name: string; _id: string } | null) => {
        if (localSubject) {
            const updatedSubject = { ...localSubject, room: val ? val._id : '' };
            setRoomValue(val ? val.name : '');
            setLocalSubject(updatedSubject);
            // props.onSubjectChange?.(updatedSubject); // Notify parent
        }
    };
    const handleTeacherChange = (val: { name: string; _id: string } | null) => {
        if (localSubject) {
            const updatedSubject = { ...localSubject, teacher: val ? val._id : '' };
            setTeacherValue(val ? val.name : '');
            setLocalSubject(updatedSubject);
            // props.onSubjectChange?.(updatedSubject); // Notify parent
        }
    };
    const handleProfessorChange = (_e: React.SyntheticEvent, professor: UserPopulated | null) => {
        if (professor) {
            setSelectedProfessor(professor);
            setSelectedProfessorId(professor._id);
        } else {
            setSelectedProfessor(null);
            setSelectedProfessorId('');
        }
    };

    return props.trigger && (
        <div className="popup">
            <div className="popup-inner position-relative w-100">
                <div className="d-flex pt-4">
                    <div className="buttons position-absolute">
                        <Button
                            variant="contained"
                            onClick={ () => {
                                props.setTrigger(false);
                                setShowOnlyFreeRooms(false);
                                setShowOnlyFreeTeachers(false);
                                setShowAllRooms(false);
                                setSelectedFacultyId('');
                                props.onSubjectChange?.(localSubject);
                            } }
                        >
                            Zamknij
                        </Button>
                    </div>
                    <div className="room p-2 ms-2 me-2">
                        <h3>Sala</h3>
                        <FormControlLabel
                            control={ <Checkbox/> }
                            onChange={ () => setShowAllRooms(!showAllRooms) }
                            label="Pokaż z danego wydziału"
                        />

                        { showAllRooms && (<>
                            <Select
                                className="form-select mb-2"
                                value={ selectedFacultyId }
                                onChange={ handleFacultyChange }
                            >
                                { faculties.map(faculty => (
                                    <MenuItem
                                        key={ faculty._id }
                                        value={ faculty._id }
                                        onClick={ () => {
                                            setSelectedFacultyId(faculty._id)
                                        } }
                                    >
                                        { faculty.name }
                                    </MenuItem>
                                )) }
                            </Select>

                            { selectedFacultyId && (
                                selectedFacultyBuildings?.buildings ? (
                                    <Select
                                        className="form-select mb-2"
                                        aria-label="Default select example"
                                        value={buildingName}
                                        onChange={handleBuildingChange}
                                    >
                                        { selectedFacultyBuildings.buildings.map((building, index) => (
                                            <MenuItem key={ index } value={ index }>
                                                { building.name }
                                            </MenuItem>
                                        )) }
                                    </Select>
                                ) : (<><span className="fw-bold fs-3">ERROR</span><br/></>)
                            ) }
                        </>)}
                        <FormControlLabel
                            control={ <Checkbox/> }
                            onChange={ () => setShowOnlyFreeRooms(!showOnlyFreeRooms) }
                            label="Pokaż tylko wolne sale"
                        />

                        <SearchableDropdown
                            placeholder="Wybierz salę..."
                            options={roomsList}
                            label="name"
                            id="id"
                            selectedVal={roomValue}
                            handleChange={(val) => handleRoomChange(val)} // Set empty string if val is null
                        />
                    </div>
                    <div className="teacher p-2">
                        <h3>Prowadzący</h3>
                        <FormControlLabel
                            control={ <Checkbox/> }
                            onChange={ () => setShowOnlyFreeTeachers(!showOnlyFreeTeachers) }
                            label="Pokaż tylko dostępnych prowadzących"
                        />
                        {/*<SearchableDropdown*/}
                        {/*    placeholder="Wybierz nauczyciela..."*/}
                        {/*    options={teacherList}*/}
                        {/*    label="name"*/}
                        {/*    id="id"*/}
                        {/*    selectedVal={teacherValue}*/}
                        {/*    handleChange={(val) => handleTeacherChange(val)} // Set empty string if val is null*/}
                        {/*/>*/}
                        <Autocomplete
                            clearOnEscape
                            value={ selectedProfessor }
                            options={ professors.sort((a, b) => a.surnames.localeCompare(b.surnames)) }
                            groupBy={ professor => professor.surnames[0] }
                            getOptionLabel={ professor => {
                                if (localSubject && props.subject) {
                                    if (APIUtils.isProfessorBusy(
                                        classes,
                                        professor._id,
                                        props.subject?.setday,
                                        localSubject.x + 1)
                                    ) {
                                        return `❌ ${ professor.surnames } ${ professor.names } (zajęty/a)`;
                                    } else {
                                        return `${ professor.surnames } ${ professor.names }`;
                                    }
                                } else {
                                    return `${ professor.surnames } ${ professor.names }`;
                                }
                            } }
                            onChange={ handleProfessorChange }
                            renderInput={ params => <TextField { ...params } label={ t('personal_timetable_professor') }/> }
                        />
                    </div>
                </div>
                <TextField
                    variant="outlined"
                    label="Notka"
                />
            </div>
        </div>
    );
};

export default RoomPopup;
