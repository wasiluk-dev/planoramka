import React, {useEffect, useState} from "react";
import './Popup.css'
import SearchableDropdown from "../SearchableDropdown/SearchableDropdown.tsx";
import apiService from "../../../services/apiService.tsx";
import {CoursePopulated, FacultyPopulated, RoomPopulated, UserPopulated} from "../../../services/databaseTypes.tsx";
import APIUtils from "../../utils/APIUtils.ts";

type Faculties = {
    _id: string;
    acronym: string;
    name: string;
    buildings: Array<Buildings>;
    courses: Array<CoursePopulated>;
}


type Props = {
    trigger: boolean;
    setTrigger: (trigger: boolean) => void;
    pickedFaculty?: Faculties;

}

type SelectedFaculty = {
    acronym: string;
    buildings: Array<Buildings>;
    name: string;
    _id: string;
}

type Room = {
    capacity: number | null;
    number: string | null;
    numberSecondary: string| null;
    roomNumber: string| null;
    _id: string;
}

type Buildings = {
    id: string,
    acronym: string,
    name: string,
    address: string;
    rooms: Array<RoomPopulated>;
}

const RoomPopup:React.FC<Props> = (props: Props) => {

    const [roomValue, setRoomValue] = useState("Wybierz salę...");
    const [teacherValue, setTeacherValue] = useState("Wybierz nauczyciela...");
    const [newRooms, setNewRooms] = useState<Array<Room>>([]);
    const [allTeachers, setAllTeachers] = useState<Array<UserPopulated>>([])
    const [showallrooms, setShowallrooms] = useState<boolean>(false);
    const [rooms, setRooms] = useState<Array<Room>>([]);
    const [teacherList, setTeacherList] = useState();
    const [teacherSurnameList, setTeacherSurnameList] = useState<Array>([]);
    const [allFaculties, setAllFaculties] = useState([]);
    const [facultyId, setFacultyId] = useState<string>("");
    const [selectedFacultyBuildings, setSelectedFacultyBuildings] = useState<SelectedFaculty>();
    const [roomsList, setRoomsList] = useState([]);
    const [buildingName, setBuildingName] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getFaculties();
            setAllFaculties(data)
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getUsers();
            const allTeachers = APIUtils.getUsersWithRole(data, 2);

            const sortedTeachers = allTeachers?.sort((a, b) => {
                // Extract the last word (surname) from the fullName property
                const surnameA = a.fullName.split(" ").slice(-1)[0].toLowerCase();
                const surnameB = b.fullName.split(" ").slice(-1)[0].toLowerCase();

                // Compare surnames
                return surnameA.localeCompare(surnameB);
            });
            const modifiedNames = sortedTeachers?.map(teacher => {
                const nameParts = teacher.fullName.split(" ");
                const surname = nameParts.slice(-1)[0];
                const firstName = nameParts.slice(0, -1).join(" ");
                return {
                    _id: teacher._id,
                    name: `${surname} ${firstName}`
                };

            });

// Log or save the modified names
            console.log(modifiedNames)
            setTeacherSurnameList(modifiedNames)

// Save the sorted data
            setAllTeachers(sortedTeachers);
        };
        fetchData();
    }, [props.trigger]);
    useEffect(() => {
        if (props.pickedFaculty?.buildings && props.pickedFaculty.buildings.length > 0) {
            const allRooms = props.pickedFaculty.buildings.flatMap(building => building.rooms || []);
            setRooms(allRooms);
        }
    }, [showallrooms, props.trigger]);

    useEffect(() => {
        setTeacherList(teacherSurnameList.map(teacher => ({
            id: teacher._id,
            name: teacher.name

        })))
    }, [teacherSurnameList]);


    useEffect(() => {
        setRoomsList(rooms.map(room => ({
            id: room._id,
            name: room.numberSecondary

        })))
    }, [rooms]);

    useEffect(() => {
        setRoomsList(rooms.map(room => ({
            id: room._id,
            name: room.numberSecondary

        })))
    }, [!showallrooms]);

    useEffect(() => {
        setRoomsList(newRooms.map(room => ({
            id: room._id,
            name: room.numberSecondary

        })))
    }, [newRooms]);

    const handleBuildingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setNewRooms(selectedFacultyBuildings.buildings[Number(selectedValue)].rooms);
        setBuildingName(selectedValue);
    };

    const handleFacultyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setBuildingName("")
        setFacultyId(selectedValue);
        setSelectedFacultyBuildings(allFaculties.find(
            (faculty) => faculty._id === selectedValue
        ))
    };
// console.log(teacherList)
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner position-relative p-5, w-100 d-flex pt-4">
                <div className="buttons position-absolute">
                    <button className="btn btn-success close-btn me-2"
                        /*onClick={() => props.setTrigger(false)}*/>
                        Zatwierdź
                    </button>
                    <button className="btn btn-secondary close-btn"
                            onClick={() => props.setTrigger(false)}>
                        Zamknij
                    </button>
                </div>
                <div className="room p-2 ms-2 me-2">
                    <h3>Sala</h3>
                    <input className="form-check-input me-2 mb-2" type="checkbox"
                           onChange={() => {
                        setShowallrooms(!showallrooms);
                    }}
                           id="flexCheckDefault"/>
                    <label className="form-check-label mb-2" htmlFor="flexCheckDefault">
                        Pokaż z danego wydziału
                    </label><br/>
                    {showallrooms ? (
                        <>
                            <select
                                className="form-select mb-2"
                                aria-label="Default select example"
                                value={facultyId}
                                onChange={handleFacultyChange}
                            >
                                <option value="" disabled hidden>Wybierz Wydział</option>
                                {allFaculties.map(faculty => (
                                    <option key={faculty._id} value={faculty._id} onClick={() =>{ setFacultyId(faculty._id)}}>
                                        {faculty.name}
                                    </option>
                                ))}
                            </select>
                            {facultyId ? (
                                selectedFacultyBuildings.buildings ? (
                                    <select
                                        className="form-select mb-2"
                                        aria-label="Default select example"
                                        value={buildingName}
                                        onChange={handleBuildingChange}
                                    >
                                        <option value="" disabled hidden>Wybierz Budynek</option>
                                        {selectedFacultyBuildings.buildings.map((building, index) => (
                                            <option key={building.acronym} value={index}>
                                                {building.name}
                                            </option>
                                        ))}
                                    </select>
                                ):(<><span className="fw-bold fs-3">ERROR</span><br/></>)
                            ) : ("")}
                        </>
                    ) : ("")}
                    <input className="form-check-input me-2 mb-2" type="checkbox" value="" id="flexCheckDefault"/>
                    <label className="form-check-label mb-2" htmlFor="flexCheckDefault">
                        Pokaż tylko wolne sale
                    </label><br/>
                    <SearchableDropdown
                        options={roomsList}
                        label="name"
                        id="id"
                        selectedVal={roomValue}
                        handleChange={(val) => setRoomValue(val)}
                    />
                </div>
                <div className="teacher p-2">
                    <h3>Wykładowca</h3>
                    <input className="form-check-input me-2 mb-2" type="checkbox" value="" id="flexCheckDefault"/>
                    <label className="form-check-label mb-2" htmlFor="flexCheckDefault">
                        Pokaż tylko dostępnych prowadzących
                    </label><br/>
                    <SearchableDropdown
                        options={teacherList}
                        label="name"
                        id="id"
                        selectedVal={teacherValue}
                        handleChange={(val) => setTeacherValue(val)}
                    />
                </div>
            </div>
        </div>
    ) : ("");
};

export default RoomPopup;