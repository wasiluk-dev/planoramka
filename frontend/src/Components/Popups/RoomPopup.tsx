import React, { useEffect, useState } from 'react';
import './Popup.css';
import SearchableDropdown from '../SearchableDropdown/SearchableDropdown.tsx';
import APIService from '../../../services/apiService.tsx';
import {ClassPopulated, FacultyPopulated, RoomPopulated, UserPopulated} from '../../../services/databaseTypes.tsx';
import APIUtils from "../../utils/APIUtils.ts";
import EUserRole from '../../../../backend/src/enums/EUserRole.ts';

type SubjcetPopup = {
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



type Props = {
    trigger: boolean;
    setTrigger: (trigger: boolean) => void;
    pickedFaculty?: FacultyPopulated;
    subject?: SubjcetPopup;
    onSubjectChange?: (updatedSubject: SubjcetPopup) => void;
}

const RoomPopup: React.FC<Props> = (props: Props) => {
    const [roomValue, setRoomValue] = useState<string>('');
    const [teacherValue, setTeacherValue] = useState<string>('');
    const [newRooms, setNewRooms] = useState<RoomPopulated[]>([]);
    const [classes, setClasses] = useState<Array<ClassPopulated>>([])
    const [allTeachers, setAllTeachers] = useState<UserPopulated[]>([]);
    const [showOnlyFreeTeachers, setShowOnlyFreeTeachers] = useState<boolean>(false)
    const [showOnlyFreeRooms, setShowOnlyFreeRooms] = useState<boolean>(false)
    const [showAllRooms, setShowAllRooms] = useState<boolean>(false);
    const [rooms, setRooms] = useState<RoomPopulated[]>([]);
    const [teacherList, setTeacherList] = useState<Pick<UserPopulated, '_id' | 'fullName'>[]>([]);
    const [teacherSurnameList, setTeacherSurnameList] = useState<Pick<UserPopulated, '_id' | 'fullName'>[]>([]);
    const [allFaculties, setAllFaculties] = useState<FacultyPopulated[]>([]);
    const [facultyId, setFacultyId] = useState<string>('');
    const [selectedFacultyBuildings, setSelectedFacultyBuildings] = useState<Omit<FacultyPopulated, 'courses'>>();
    const [roomsList, setRoomsList] = useState<Pick<RoomPopulated, '_id' | 'roomNumber'>[]>([]);
    const [buildingName, setBuildingName] = useState<string>('');
    const [localSubject, setLocalSubject] = useState<SubjcetPopup | undefined>(props.subject);

    useEffect(() => {
        setLocalSubject(props.subject); // Sync with incoming prop when `props.subject` changes
    }, [props.subject]);

    useEffect(() => {
        const fetchData = async() => setAllFaculties(await APIService.getFaculties());
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async() => setClasses(await APIService.getClasses());
        fetchData();
    }, [props.trigger]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await APIService.getUsers();
            const allTeachers = APIUtils.getUsersWithRole(data, EUserRole.Professor);

            // TODO: rework after splitting fullName into names and surnames
            const teachersSorted = allTeachers.sort((a, b) => {
                const surnameA = a.fullName.split(' ').slice(-1)[0].toLowerCase();
                const surnameB = b.fullName.split(' ').slice(-1)[0].toLowerCase();
                return surnameA.localeCompare(surnameB);
            });

            const modifiedNames = teachersSorted.map(teacher => {
                const fullNameParts = teacher.fullName.split(' ');
                const surnames = fullNameParts.slice(-1)[0];
                const names = fullNameParts.slice(0, -1).join(' ');
                return {
                    _id: teacher._id,
                    fullName: `${surnames} ${names}`
                };
            });

            setTeacherSurnameList(modifiedNames);
            setAllTeachers(teachersSorted);
        };

        fetchData();
    }, [props.trigger]);

    useEffect(() => {
        if (props.pickedFaculty?.buildings && props.pickedFaculty.buildings.length > 0) {
            const allRooms = props.pickedFaculty.buildings.flatMap(building => building.rooms || []);
            setRooms(allRooms);
        }
    }, [showAllRooms, props.trigger]);

    useEffect(() => {
        setTeacherList(teacherSurnameList.map(teacher => ({
            _id: teacher._id,
            name: teacher.fullName,
        })))
    }, [teacherSurnameList]);

    useEffect(() => {
        setRoomsList(rooms.map(room => ({
            _id: room._id,
            name: room.roomNumber,
        })))
    }, [rooms, newRooms, !showAllRooms]);

    const handleBuildingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        if (selectedFacultyBuildings) {
            setNewRooms(selectedFacultyBuildings.buildings[Number(selectedValue)].rooms);
            setBuildingName(selectedValue);
        }
    };

    const handleFacultyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setBuildingName('');
        setFacultyId(selectedValue);
        setSelectedFacultyBuildings(allFaculties.find(
            (faculty) => faculty._id === selectedValue
        ))
    };

    useEffect(() => {
        if (!props.subject && props.trigger) {
            console.error("Problem z przekazaniem obiektu zajęcia")
        }else if (props.trigger) {
            // console.log(props.subject);
            if(props.subject?.teacher){
                const selectTeacher = teacherList.filter((teacher) => teacher._id === props.subject?.teacher)
                setTeacherValue(selectTeacher[0].name);
            }
            if (props.subject?.room){
                const selectRoom = rooms.filter((room) => room._id === props.subject?.room)
                setRoomValue(selectRoom[0].roomNumber)

            }
        }
    }, [teacherList, roomsList]);

    useEffect(() => {
        if (showOnlyFreeRooms && props.trigger){
            if (localSubject && classes.length > 0){
                const freeRooms: Array<RoomPopulated> = APIUtils.getUnoccupiedRooms(classes, rooms, localSubject?.setday, localSubject?.x + 1)
                const setroom = freeRooms.find(room => room.roomNumber === roomValue) || null
                if (setroom === null){ //nwm czemu to nie działa, ale trudno
                    setRoomValue('')
                }
                setRoomsList(freeRooms.map(room => ({
                    _id: room._id,
                    name: room.roomNumber,
                })))
            }else {
                console.error("Error localsubjectu lub classes!")
            }

        }else if (!showOnlyFreeRooms && props.trigger){
            const selectRoom = rooms.filter((room) => room._id === props.subject?.room)
            setRoomValue(selectRoom[0].roomNumber)
            setRoomsList(rooms.map(room => ({
                _id: room._id,
                name: room.roomNumber,
            })))
        }else if (props.trigger) {
            console.error("Nieoczekiwany błąd!")
        }
    }, [showOnlyFreeRooms]);


    const handleRoomChange = (val) =>{
        if (localSubject) {
            setRoomValue(val.name)
            const updatedSubject = { ...localSubject, room: val._id  };
            setLocalSubject(updatedSubject);
            props.onSubjectChange?.(updatedSubject); // Notify parent
        }
    }

    const handleTeacherChange = (val) =>{
        if (localSubject) {
            setTeacherValue(val.name)
            const updatedSubject = { ...localSubject, teacher: val._id };
            setLocalSubject(updatedSubject);
            props.onSubjectChange?.(updatedSubject); // Notify parent
        }
    }

    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner position-relative p-5, w-100 d-flex pt-4">
                <div className="buttons position-absolute">
                    <button className="btn btn-secondary close-btn me-2 mb-2"
                            onClick={ () => {
                                props.setTrigger(false)
                                setShowOnlyFreeRooms(false)
                                setShowOnlyFreeTeachers(false)
                                setShowAllRooms(false)
                                setFacultyId("")
                            }}
                    >
                        Zamknij
                    </button>
                </div>
                <div className="room p-2 ms-2 me-2">
                    <h3>Sala</h3>
                    <input className="form-check-input me-2 mb-2" type="checkbox"
                           onChange={ () => setShowAllRooms(!showAllRooms) }
                           id="flexCheckDefault"/>
                    <label className="form-check-label mb-2" htmlFor="flexCheckDefault">
                        Pokaż z danego wydziału
                    </label><br/>
                    { showAllRooms ? (<>
                        <select
                            className="form-select mb-2"
                            aria-label="Default select example"
                            value={ facultyId }
                            onChange={ handleFacultyChange }
                        >
                            <option value="" disabled hidden>[Wydział]</option>
                            { allFaculties.map(faculty => (
                                <option key={ faculty._id } value={ faculty._id } onClick={ () => { setFacultyId(faculty._id) } }>
                                    { faculty.name }
                                </option>
                            )) }
                        </select>
                        { facultyId ? (
                            selectedFacultyBuildings?.buildings ? (
                                <select
                                    className="form-select mb-2"
                                    aria-label="Default select example"
                                    value={buildingName}
                                    onChange={handleBuildingChange}
                                >
                                    <option value="" disabled hidden>[Budynek]</option>
                                    { selectedFacultyBuildings.buildings.map((building, index) => (
                                        <option key={ building.acronym } value={ index }>
                                            { building.name }
                                        </option>
                                    ))}
                                </select>
                            ) : (<><span className="fw-bold fs-3">ERROR</span><br/></>)
                        ) : ('') }
                    </>) : ('') }
                    <input className="form-check-input me-2 mb-2" type="checkbox"
                           onChange={() => setShowOnlyFreeRooms(!showOnlyFreeRooms)} id="flexCheckDefault"
                    />
                    <label className="form-check-label mb-2" htmlFor="flexCheckDefault">
                        Pokaż tylko wolne sale
                    </label><br/>
                    <SearchableDropdown
                        placeholder = "Wybierz salę..."
                        options={ roomsList }
                        label="name"
                        id="id"
                        selectedVal={ roomValue }
                        handleChange={ (val) => handleRoomChange(val) } // Set empty string if val is null
                    />
                </div>
                <div className="teacher p-2">
                    <h3>Prowadzący</h3>
                    <input className="form-check-input me-2 mb-2" type="checkbox" value="" id="flexCheckDefault"/>
                    <label className="form-check-label mb-2" htmlFor="flexCheckDefault">
                        Pokaż tylko dostępnych prowadzących
                    </label><br/>
                    <SearchableDropdown
                        placeholder = "Wybierz nauczyciela..."
                        options={ teacherList }
                        label="name"
                        id="id"
                        selectedVal={ teacherValue }
                        handleChange={ (val) => handleTeacherChange(val) } // Set empty string if val is null
                    />
                </div>
            </div>
        </div>
    ) : ('');
};

export default RoomPopup;
