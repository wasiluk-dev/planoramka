import React, {useEffect, useState} from "react";
import './Popup.css'
import SearchableDropdown from "../SearchableDropdown/SearchableDropdown.tsx";
import apiService from "../../../services/apiService.tsx";

type Props = {
    trigger: boolean;
    setTrigger: (trigger: boolean) => void;
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
    acronym: string;
    name: string;
    rooms: Array<Room>;
    _id: string;
}

const RoomPopup:React.FC<Props> = (props: Props) => {

    const [roomValue, setRoomValue] = useState("Wybierz salę...");
    const [teacherValue, setTeacherValue] = useState("Wybierz nauczyciela...");
    const [selectedBuilding, setSelectedBuilding] = useState<Buildings>(
        {
            acronym: "string",
            name: "string",
            rooms: [],
            _id: "string"
});
    const [showallrooms, setShowallrooms] = useState<boolean>(false);
    const [rooms, setRooms] = useState<Array<Room>>([]);
    const [allFaculties, setAllFaculties] = useState([]);
    const [facultyId, setFacultyId] = useState<string>("");
    const [selectedFacultyBuildings, setSelectedFacultyBuildings] = useState<SelectedFaculty>();
    const [roomsList, setRoomsList] = useState([]);
    const [buildingName, setBuildingName] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getRooms();
            setRooms(data)
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getFaculties();
            setAllFaculties(data)
        };
        fetchData();
    }, []);

    useEffect(() => {
        setRoomsList(rooms.map(room => ({
            id: room._id,
            name: room.numberSecondary

        })))
    }, [rooms]);


    const handleBuildingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setRooms(selectedFacultyBuildings.buildings[Number(selectedValue)].rooms);
        console.log(selectedFacultyBuildings.buildings[Number(selectedValue)].rooms)
        setBuildingName(selectedValue);
    };

    const handleFacultyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
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
                        /*onClick={() => props.setTrigger(false)}*/>
                        Zatwierdź
                    </button>
                    <button className="btn btn-secondary close-btn"
                            onClick={() => props.setTrigger(false)}>
                        Zamknij
                    </button>
                </div>
                <div className="room p-2 ms-2 me-2">
                    <h3>Wybierz sale</h3>
                    <input className="form-check-input me-2 mb-2" type="checkbox"
                           onChange={() => {
                        setShowallrooms(!showallrooms);
                    }}
                           id="flexCheckDefault"/>
                    <label className="form-check-label mb-2" htmlFor="flexCheckDefault">
                        Pokaż wszystkie sale
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
                    <h3>Wybierz prowadzącego</h3>
                    <input className="form-check-input me-2 mb-2" type="checkbox" value="" id="flexCheckDefault"/>
                    <label className="form-check-label mb-2" htmlFor="flexCheckDefault">
                        Pokaż wszystkich prowadzących
                    </label><br/>
                    <input className="form-check-input me-2 mb-2" type="checkbox" value="" id="flexCheckDefault"/>
                    <label className="form-check-label mb-2" htmlFor="flexCheckDefault">
                        Pokaż tylko dostępnych prowadzących
                    </label><br/>
                    <SearchableDropdown
                        options={[
                            {id: "1", name: "Lion"},
                            {id: "2", name: "Tiger"},
                            {id: "3", name: "Elephant"},
                            {id: "4", name: "Bear"},
                            {id: "5", name: "Fox"},
                            {id: "6", name: "Wolf"},
                            {id: "7", name: "Deer"},
                            {id: "8", name: "Rabbit"},
                            {id: "9", name: "Giraffe"},
                            {id: "10", name: "Zebra"},
                            {id: "11", name: "Kangaroo"},
                            {id: "12", name: "Panda"},
                        ]}
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