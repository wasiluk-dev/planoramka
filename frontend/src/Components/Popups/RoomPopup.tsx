import React, { useEffect, useState } from 'react';
import {
    Autocomplete,
    Button,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Select, SelectChangeEvent,
    TextField,
} from '@mui/material';

import './Popup.css';
import APIService from '../../../services/APIService.ts';
import APIUtils from '../../utils/APIUtils.ts';
import EUserRole from '../../../../backend/src/enums/EUserRole.ts';
import { ClassPopulated, FacultyPopulated, RoomPopulated, UserPopulated } from '../../../services/DBTypes.ts';
import { SubjectPopup } from '../../views/TimetableMaker.tsx';
import i18n, { i18nPromise } from '../../i18n';

const { t } = i18n;
await i18nPromise;

type RoomPopupProps = {
    trigger: boolean;
    setTrigger: (trigger: boolean) => void;
    pickedFaculty?: FacultyPopulated;
    subject?: SubjectPopup;
    onSubjectChange?: (updatedSubject: SubjectPopup) => void;
}
const RoomPopup: React.FC<RoomPopupProps> = ({ trigger, setTrigger, pickedFaculty, subject, onSubjectChange }) => {
    const [localSubject, setLocalSubject] = useState<SubjectPopup | undefined>(subject);

    // database entries
    const [classes, setClasses] = useState<ClassPopulated[]>([]);
    const [faculties, setFaculties] = useState<FacultyPopulated[]>([]);
    const [professors, setProfessors] = useState<UserPopulated[]>([]);
    const [rooms, setRooms] = useState<RoomPopulated[]>([]);
    const [users, setUsers] = useState<UserPopulated[]>([]);

    // popup checkboxes
    const [showAllRooms, setShowAllRooms] = useState<boolean>(false);
    const [showOnlyFreeProfessors, setShowOnlyFreeProfessors] = useState<boolean>(false);
    const [showOnlyFreeRooms, setShowOnlyFreeRooms] = useState<boolean>(false);

    // selected data
    const [selectedBuildingId, setSelectedBuildingId] = useState<string>('');
    const [selectedFaculty, setSelectedFaculty] = useState<Omit<FacultyPopulated, 'courses'>>();
    const [selectedFacultyId, setSelectedFacultyId] = useState<string>('');
    const [selectedProfessor, setSelectedProfessor] = useState<UserPopulated | undefined>(undefined);
    const [selectedRoom, setSelectedRoom] = useState<RoomPopulated | undefined>(undefined);

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
        if (subject) {
            setSelectedProfessor(users.find(user => user._id === subject.organizerId));
            setSelectedRoom(rooms.find(room => room._id === subject.roomId));
        }
    }, [subject]);
    useEffect(() => {
        const fetchData = async() => {
            setClasses(await APIService.getClasses());
        };

        fetchData().then();
    }, [trigger]);
    useEffect(() => {
        setLocalSubject(subject);
    }, [subject]);
    useEffect(() => {
        if (pickedFaculty?.buildings && pickedFaculty.buildings.length > 0) {
            const allRooms = pickedFaculty.buildings.flatMap(building => building.rooms || []);
            setRooms(allRooms);
        }
    }, [trigger, showAllRooms]);

    const handleFacultyChange = (event: SelectChangeEvent) => {
        const facultyId: string = event.target.value;

        setSelectedFacultyId(facultyId);
        setSelectedFaculty(faculties.find(faculty => faculty._id === facultyId));
        setSelectedBuildingId('');
    };
    const handleBuildingChange = (event: SelectChangeEvent) => {
        const buildingId = event.target.value;
        if (selectedFaculty) {
            // setNewRooms(selectedFacultyBuildings.buildings[Number(selectedValue)].rooms);
            setSelectedBuildingId(buildingId);
        }
    };
    const handleRoomChange = (_e: React.SyntheticEvent, room: RoomPopulated | null) => {
        if (room) {
            setSelectedRoom(room);
            if (localSubject) {
                const updatedSubject = { ...localSubject, roomId: room._id };
                setLocalSubject(updatedSubject);
                onSubjectChange?.(updatedSubject);
            }
        } else {
            setSelectedRoom(undefined);
        }
    };
    const handleProfessorChange = (_e: React.SyntheticEvent, professor: UserPopulated | null) => {
        if (professor) {
            setSelectedProfessor(professor);
            if (localSubject) {
                const updatedSubject = { ...localSubject, organizerId: professor._id };
                setLocalSubject(updatedSubject);
                onSubjectChange?.(updatedSubject);
            }
        } else {
            setSelectedProfessor(undefined);
        }
    };

    return trigger && (
        <div className="popup">
            <div className="popup-inner position-relative w-100 p-4">
                <h3>Szczegóły zajęć</h3>
                <div className="d-flex">
                    <div className="buttons position-absolute">
                        <Button
                            variant="contained"
                            onClick={ () => {
                                setTrigger(false);
                                setShowOnlyFreeRooms(false);
                                setShowOnlyFreeProfessors(false);
                                setShowAllRooms(false);
                                setSelectedFacultyId('');
                                if (localSubject) onSubjectChange?.(localSubject);
                            } }
                        >
                            Zapisz
                        </Button>
                    </div>

                    <div className="teacher p-2">
                        <Autocomplete
                            clearOnEscape
                            value={ selectedProfessor || null }
                            options={ professors
                                .filter(professor => {
                                    if (localSubject && subject && showOnlyFreeProfessors) {
                                        return !APIUtils.isProfessorBusy(
                                            classes,
                                            professor._id,
                                            subject?.setday,
                                            localSubject.x + 1
                                        );
                                    } else return true;
                                })
                                .sort((a, b) => a.surnames.localeCompare(b.surnames))
                            }
                            groupBy={ professor => professor.surnames[0] }
                            getOptionLabel={ professor => {
                                if (localSubject && subject) {
                                    if (
                                        APIUtils.isProfessorBusy(
                                            classes,
                                            professor._id,
                                            subject?.setday,
                                            localSubject.x + 1
                                        )
                                    ) {
                                        return `❌ ${ professor.surnames } ${ professor.names } (${ t('maker_popup_organizer_busy') })`;
                                    } else {
                                        return `${ professor.surnames } ${ professor.names }`;
                                    }
                                } else {
                                    return `${ professor.surnames } ${ professor.names }`;
                                }
                            } }
                            onChange={ handleProfessorChange }
                            renderInput={ params => <TextField { ...params } label={ t('maker_popup_organizer') }/> }
                        />

                        <FormControlLabel
                            label={ t('maker_popup_organizer_free_only') }
                            control={ <Checkbox/> }
                            onChange={ () => setShowOnlyFreeProfessors(!showOnlyFreeProfessors) }
                        />
                    </div>

                    <div className="room p-2 ms-2 me-2">
                        <Autocomplete
                            clearOnEscape
                            value={ selectedRoom || null }
                            options={ rooms }
                            groupBy={ room => room.roomNumber[0] }
                            getOptionLabel={ room => {
                                return room.roomNumber;
                            } }
                            onChange={ handleRoomChange }
                            renderInput={ params => <TextField { ...params } label={ t('personal_timetable_room') }/> }
                        />

                        <FormControlLabel
                            label={ t('maker_popup_room_free_only') }
                            control={ <Checkbox/> }
                            onChange={ () => setShowOnlyFreeRooms(!showOnlyFreeRooms) }
                        />

                        {/*<FormControlLabel*/}
                        {/*    label={ t('maker_popup_room_from_faculty') }*/}
                        {/*    control={ <Checkbox/> }*/}
                        {/*    onChange={ () => setShowAllRooms(!showAllRooms) }*/}
                        {/*/>*/}

                        { showAllRooms && (<>
                            <Select
                                className="form-select mb-2"
                                value={ selectedFacultyId }
                                onChange={ handleFacultyChange }
                            >
                                { faculties.map(faculty =>
                                    <MenuItem
                                        key={ faculty._id }
                                        value={ faculty._id }
                                        disabled={ faculty.buildings.length === 0 }
                                    >
                                        { faculty.name }
                                    </MenuItem>
                                )}
                            </Select>

                            { selectedFacultyId && (
                                selectedFaculty?.buildings.length !== 0 && (
                                    <Select
                                        className="form-select mb-2"
                                        value={ selectedBuildingId }
                                        onChange={ handleBuildingChange }
                                    >
                                        { selectedFaculty?.buildings.map(building =>
                                            <MenuItem key={ building._id } value={ building._id }>
                                                { building.name }
                                            </MenuItem>
                                        ) }
                                    </Select>
                                )
                            )}
                        </>) }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomPopup;
