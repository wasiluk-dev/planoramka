import React, {useState} from "react";
import './Popup.css'
import SearchableDropdown from "../SearchableDropdown/SearchableDropdown.tsx";

type Props = {
    trigger: boolean;
    setTrigger: (trigger: boolean) => void;
}

const RoomPopup:React.FC<Props> = (props: Props) => {

    const [roomValue, setRoomValue] = useState("Select option...");
    const [teacherValue, setTeacherValue] = useState("Select option...");
    const [selectedGroupType, setSelectedGroupType] = useState<string>("");


    const handleGroupTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setSelectedGroupType(selectedValue);
    };

    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner position-relative p-5, w-100 d-flex">
                <button className="btn btn-secondary position-absolute close-btn"
                        onClick={() => props.setTrigger(false)}>
                    Zamknij
                </button>
                <div className="room p-2 ms-2">
                    <h3>Wybierz sale</h3>
                    <input className="form-check-input me-2" type="checkbox" value="" id="flexCheckDefault"/>
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                        Pokaż wszystkie sale
                    </label><br/>
                    <input className="form-check-input me-2" type="checkbox" value="" id="flexCheckDefault"/>
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                        Pokaż tylko wolne sale
                    </label><br/>
                    <select
                        className="form-select"
                        aria-label="Default select example"
                        value={selectedGroupType}
                        onChange={handleGroupTypeChange}
                    >
                        <option value="" disabled hidden>Wybierz wydział</option>
                        {/*{wydzialyOptions.map(([key, value]) => (*/}
                        {/*    <option key={key} value={key}>{value}</option>*/}
                        {/*))}*/}
                        <option>Walju</option>
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
                        label="room"
                        id="room"
                        selectedVal={roomValue}
                        handleChange={(val) => setRoomValue(val)}
                    />
                </div>
                <div className="teacher p-2">
                    <h3>Wybierz prowadzącego</h3>
                    <input className="form-check-input me-2" type="checkbox" value="" id="flexCheckDefault"/>
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                        Pokaż wszystkich prowadzących
                    </label><br/>
                    <input className="form-check-input me-2" type="checkbox" value="" id="flexCheckDefault"/>
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                        Pokaż tylko wolnych prowadzących
                    </label><br/>
                    <select
                        className="form-select"
                        aria-label="Default select example"
                        value={selectedGroupType}
                        onChange={handleGroupTypeChange}
                    >
                        <option value="" disabled hidden>Wybierz wydział</option>
                        {/*{wydzialyOptions.map(([key, value]) => (*/}
                        {/*    <option key={key} value={key}>{value}</option>*/}
                        {/*))}*/}
                        <option>Walju</option>
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
                        selectedVal={teacherValue}
                        handleChange={(val) => setTeacherValue(val)}
                    />
                </div>
            </div>
        </div>
    ) : ("");
};

export default RoomPopup;