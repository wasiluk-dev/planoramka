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
    const [teacherList, setTeacherList] = useState<Pick<UserPopulated, '_id' | 'surnames' | 'names'>[]>([]);
    const [teacherSurnameList, setTeacherSurnameList] = useState<Pick<UserPopulated, '_id' | 'surnames' | 'names'>[]>([]);
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
        if (props.trigger){
            const fetchData = async () => {
                const data = await APIService.getUsers();
                const allTeachers = APIUtils.getUsersWithRole(data, EUserRole.Professor);
                const teachersSorted = allTeachers.sort((a, b) =>
                    a.surnames.localeCompare(b.surnames, "pl")
                );


                const modifiedNames = allTeachers.map(teacher => {
                    let isFree: boolean = false
                    if (props.subject && localSubject){
                        isFree = APIUtils.isProfessorBusy(classes, teacher._id, props.subject?.setday, localSubject?.x + 1);
                    }
                    const surnames = teacher.surnames
                    const names = teacher.names
                    if (isFree){
                        return {
                            _id: teacher._id,
                            names: teacher.names,
                            surnames: teacher.surnames + " (ZAJĘTY/A)",
                            fullName: `${surnames} ${names}`
                        };
                    }else {
                        return {
                            _id: teacher._id,
                            names: teacher.names,
                            surnames: teacher.surnames,
                            fullName: `${surnames} ${names}`
                        };
                    }
                });

                setTeacherSurnameList(modifiedNames);
                setAllTeachers(teachersSorted);
            };

            fetchData();
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
            name: teacher.names + " " + teacher.surnames,
        })))
    }, [teacherSurnameList, props.trigger]);

    useEffect(() => {
        setRoomsList(
            rooms.map(room => {
                const isOccupied = APIUtils.isRoomOccupied(classes, room._id, localSubject?.setday, localSubject?.x + 1);
                return {
                    _id: room._id,
                    name: isOccupied ? `${room.roomNumber} (Zajęta)` : room.roomNumber,
                };
            })
        );
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
            if(props.subject?.teacher){
                const selectTeacher = teacherList.filter((teacher) => teacher._id === props.subject?.teacher)
                if (selectTeacher.length < 1){
                    setTeacherValue('')
                }else {
                    setTeacherValue(selectTeacher[0].name);
                }
            }
            if (props.subject?.room){
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
            if (localSubject){
                if (APIUtils.isRoomOccupied(classes, selectRoom[0]._id,localSubject?.setday, localSubject?.x + 1)){
                    setRoomValue(selectRoom[0].roomNumber + " (ZAJĘTA)")
                } else {
                    setRoomValue(selectRoom[0].roomNumber)
                }
            }
            setRoomsList(
                rooms.map(room => {
                    const isOccupied = APIUtils.isRoomOccupied(classes, room._id, localSubject?.setday, localSubject?.x + 1);
                    return {
                        _id: room._id,
                        name: isOccupied ? `${room.roomNumber} (Zajęta)` : room.roomNumber,
                    };
                })
            );
        }else if (props.trigger) {
            console.error("Nieoczekiwany błąd!")
        }
    }, [showOnlyFreeRooms]);

    useEffect(() => {
        if (showOnlyFreeTeachers && props.trigger){
            if (localSubject && allTeachers.length > 0){
                const freeteachers = APIUtils.getFreeProfessors(allTeachers, classes, localSubject?.setday, localSubject?.x + 1)
                const modifiedNames = freeteachers.map(teacher => {
                    const surnames = teacher.surnames
                    const names = teacher.names
                    return {
                        _id: teacher._id,
                        names: teacher.names,
                        surnames: teacher.surnames,
                        fullName: `${surnames} ${names}`
                    };
                });

                setTeacherSurnameList(modifiedNames);

            }else {
                console.error("Error localsubjectu lub teacher'a!")
            }

        }else if (!showOnlyFreeTeachers && props.trigger){
            const modifiedNames = allTeachers.map(teacher => {
                let isFree: boolean = false
                if (props.subject && localSubject){
                    isFree = APIUtils.isProfessorBusy(classes, teacher._id, props.subject?.setday, localSubject?.x + 1);
                }else {
                    console.error("Subject problem!")
                }
                const surnames = teacher.surnames
                const names = teacher.names
                if (isFree){
                    return {
                        _id: teacher._id,
                        names: teacher.names,
                        surnames: teacher.surnames + " (ZAJĘTY/A)",
                        fullName: `${surnames} ${names}`
                    };
                }else {
                    return {
                        _id: teacher._id,
                        names: teacher.names,
                        surnames: teacher.surnames,
                        fullName: `${surnames} ${names}`
                    };
                }
            });

            setTeacherSurnameList(modifiedNames);

        }else if (props.trigger){
            console.error("Nieoczekiwany błąd!")
        }

    }, [showOnlyFreeTeachers, props.trigger]);


    const handleRoomChange = (val: { name: string; _id: string } | null) => {
        if (localSubject) {
            const roomValue = val ? val.name : '';
            const updatedSubject = { ...localSubject, room: val ? val._id : '' };
            setRoomValue(roomValue);
            setLocalSubject(updatedSubject);
            // props.onSubjectChange?.(updatedSubject); // Notify parent
        }
    };

    const handleTeacherChange = (val: { name: string; _id: string } | null) => {
        if (localSubject) {
            const teacherValue = val ? val.name : '';
            const updatedSubject = { ...localSubject, teacher: val ? val._id : '' };
            setTeacherValue(teacherValue);
            setLocalSubject(updatedSubject);
            // props.onSubjectChange?.(updatedSubject); // Notify parent
        }
    };

    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner position-relative w-100">
                <div className="d-flex pt-4">
                    <div className="buttons position-absolute">
                        <button className="btn btn-secondary close-btn me-2 mb-2"
                                onClick={() => {
                                    props.setTrigger(false)
                                    setShowOnlyFreeRooms(false)
                                    setShowOnlyFreeTeachers(false)
                                    setShowAllRooms(false)
                                    setFacultyId("")
                                    props.onSubjectChange?.(localSubject)
                                }}
                        >
                            Zamknij
                        </button>
                    </div>
                    <div className="room p-2 ms-2 me-2">
                        <h3>Sala</h3>
                        <input className="form-check-input me-2 mb-2" type="checkbox"
                               onChange={() => setShowAllRooms(!showAllRooms)}
                               id="flexCheckDefault"/>
                        <label className="form-check-label mb-2" htmlFor="flexCheckDefault">
                            Pokaż z danego wydziału
                        </label><br/>
                        {showAllRooms ? (<>
                            <select
                                className="form-select mb-2"
                                aria-label="Default select example"
                                value={facultyId}
                                onChange={handleFacultyChange}
                            >
                                <option value="" disabled hidden>[Wydział]</option>
                                {allFaculties.map(faculty => (
                                    <option key={faculty._id} value={faculty._id} onClick={() => {
                                        setFacultyId(faculty._id)
                                    }}>
                                        {faculty.name}
                                    </option>
                                ))}
                            </select>
                            {facultyId ? (
                                selectedFacultyBuildings?.buildings ? (
                                    <select
                                        className="form-select mb-2"
                                        aria-label="Default select example"
                                        value={buildingName}
                                        onChange={handleBuildingChange}
                                    >
                                        <option value="" disabled hidden>[Budynek]</option>
                                        {selectedFacultyBuildings.buildings.map((building, index) => (
                                            <option key={building.acronym} value={index}>
                                                {building.name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (<><span className="fw-bold fs-3">ERROR</span><br/></>)
                            ) : ('')}
                        </>) : ('')}
                        <input className="form-check-input me-2 mb-2" type="checkbox"
                               onChange={() => setShowOnlyFreeRooms(!showOnlyFreeRooms)} id="flexCheckDefault"
                        />
                        <label className="form-check-label mb-2" htmlFor="flexCheckDefault">
                            Pokaż tylko wolne sale
                        </label><br/>
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
                        <input className="form-check-input me-2 mb-2" type="checkbox"
                               onChange={() => setShowOnlyFreeTeachers(!showOnlyFreeTeachers)} id="flexCheckDefault"/>
                        <label className="form-check-label mb-2" htmlFor="flexCheckDefault">
                            Pokaż tylko dostępnych prowadzących
                        </label><br/>
                        <SearchableDropdown
                            placeholder="Wybierz nauczyciela..."
                            options={teacherList}
                            label="name"
                            id="id"
                            selectedVal={teacherValue}
                            handleChange={(val) => handleTeacherChange(val)} // Set empty string if val is null
                        />
                    </div>
                </div>
                <div className="infobox mt-2 text-center align-content-center">
                    <h4>Notatki:</h4>
                    <input className=" w-75" type="text"/>
                </div>
            </div>
        </div>
    ) : ('');
};

export default RoomPopup;
