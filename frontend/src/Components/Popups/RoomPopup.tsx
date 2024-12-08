import React, { useEffect, useState } from 'react';
import './Popup.css';
import SearchableDropdown from '../SearchableDropdown/SearchableDropdown.tsx';
import APIService from '../../../services/apiService.tsx';
import { FacultyPopulated, RoomPopulated, UserPopulated } from '../../../services/databaseTypes.tsx';
import APIUtils from "../../utils/APIUtils.ts";
import EUserRole from '../../../../backend/src/enums/EUserRole.ts';

type Props = {
    trigger: boolean;
    setTrigger: (trigger: boolean) => void;
    pickedFaculty?: FacultyPopulated;
}

const RoomPopup: React.FC<Props> = (props: Props) => {
    const [roomValue, setRoomValue] = useState<string>('');
    const [teacherValue, setTeacherValue] = useState<string>('');
    const [newRooms, setNewRooms] = useState<RoomPopulated[]>([]);
    const [allTeachers, setAllTeachers] = useState<UserPopulated[]>([]);
    const [showAllRooms, setShowAllRooms] = useState<boolean>(false);
    const [rooms, setRooms] = useState<RoomPopulated[]>([]);
    const [teacherList, setTeacherList] = useState<Pick<UserPopulated, '_id' | 'fullName'>[]>([]);
    const [teacherSurnameList, setTeacherSurnameList] = useState<Pick<UserPopulated, '_id' | 'fullName'>[]>([]);
    const [allFaculties, setAllFaculties] = useState<FacultyPopulated[]>([]);
    const [facultyId, setFacultyId] = useState<string>('');
    const [selectedFacultyBuildings, setSelectedFacultyBuildings] = useState<Omit<FacultyPopulated, 'courses'>>();
    const [roomsList, setRoomsList] = useState<Pick<RoomPopulated, '_id' | 'roomNumber'>[]>([]);
    const [buildingName, setBuildingName] = useState<string>('');

    useEffect(() => {
        const fetchData = async() => setAllFaculties(await APIService.getFaculties());
        fetchData();
    }, []);

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

    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner position-relative p-5, w-100 d-flex pt-4">
                <div className="buttons position-absolute">
                    <button className="btn btn-success close-btn me-2"
                            // onClick={ () => props.setTrigger(false) }
                        >
                        Zatwierdź
                    </button>
                    <button className="btn btn-secondary close-btn"
                            onClick={ () => props.setTrigger(false) }
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
                    <input className="form-check-input me-2 mb-2" type="checkbox" value="" id="flexCheckDefault"/>
                    <label className="form-check-label mb-2" htmlFor="flexCheckDefault">
                        Pokaż tylko wolne sale
                    </label><br/>
                    <SearchableDropdown
                        placeholder = "Wybierz salę..."
                        options={ roomsList }
                        label="name"
                        id="id"
                        selectedVal={ roomValue }
                        handleChange={ (val) => setRoomValue(val ?? '') } // Set empty string if val is null
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
                        handleChange={ (val) => setTeacherValue(val ?? '') } // Set empty string if val is null
                    />
                </div>
            </div>
        </div>
    ) : ('');
};

export default RoomPopup;
