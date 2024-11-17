import React, {useEffect, useState} from "react";
import './Popup.css'
import SearchableDropdown from "../SearchableDropdown/SearchableDropdown.tsx";
import apiService from "../../../services/apiService.tsx";

type Props = {
    trigger: boolean;
    setTrigger: (trigger: boolean) => void;
}

const RoomPopup:React.FC<Props> = (props: Props) => {

    const [roomValue, setRoomValue] = useState("Select option...");
    const [teacherValue, setTeacherValue] = useState("Select option...");
    const [selectedGroupType, setSelectedGroupType] = useState<string>("");
    const [showallrooms, setShowallrooms] = useState<boolean>(false);
    const [rooms, setRooms] = useState([]);
    const [allFaculties, setAllFaculties] = useState([]);
    const [facultyId, setFacultyId] = useState<string>("");
    const [selectedFacultyRooms, setSelectedFacultyRooms] = useState<Array>([]);
    const [building, setBuilding] = useState<number>(0);

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


    const handleGroupTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setSelectedGroupType(selectedValue);
    };

    const handleFacultyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setFacultyId(selectedValue);
        setSelectedFacultyRooms(allFaculties.find(
            (faculty) => faculty._id === selectedValue
        ))
    };
    console.log(selectedFacultyRooms)
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner position-relative p-5, w-100 d-flex pt-4">
                <button className="btn btn-secondary position-absolute close-btn"
                        onClick={() => props.setTrigger(false)}>
                    Zamknij
                </button>
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
                                <select
                                    className="form-select mb-2"
                                    aria-label="Default select example"
                                    value={selectedGroupType}
                                    onChange={handleGroupTypeChange}
                                >
                                    <option value="" disabled hidden>Wybierz Budynek</option>
                                    {selectedFacultyRooms.buildings.map(room => (
                                        <option key={room} value={room} /*onClick={() =>{ setFacultyId(room._id)}}*/>
                                            {room}
                                        </option>
                                    ))}
                                </select>
                            ):("")}
                        </>
                    ) : ("")}
                    <input className="form-check-input me-2 mb-2" type="checkbox" value="" id="flexCheckDefault"/>
                    <label className="form-check-label mb-2" htmlFor="flexCheckDefault">
                        Pokaż tylko wolne sale
                    </label><br/>
                    <select
                        className="form-select mb-2"
                        aria-label="Default select example"
                        value={selectedGroupType}
                        onChange={handleGroupTypeChange}
                    >
                        <option value="" disabled hidden>Wybierz rodzaj grupy</option>
                        {/*{wydzialyOptions.map(([key, value]) => (*/}
                        {/*    <option key={key} value={key}>{value}</option>*/}
                        {/*))}*/}
                        <option>PS</option>
                        <option>nwm</option>
                        <option>Cokoliwke</option>
                    </select>
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