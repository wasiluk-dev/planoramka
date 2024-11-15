import React from "react";
import './Popup.css'

type Props = {
    trigger: boolean;
    setTrigger: (trigger: boolean) => void;
}

const RoomPopup:React.FC<Props> = (props: Props) => {
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner position-relative p-5, w-100 d-flex">
                <button className="btn btn-secondary position-absolute close-btn"
                        onClick={() => props.setTrigger(false)}>
                    Zamknij
                </button>
                <div className="room">
                    <h3>Wybierz sale</h3>
                </div>
                <div className="teacher">
                    <h3>Wybierz prowadzącego</h3>
                </div>
            </div>
        </div>
    ) : ("");
};

export default RoomPopup;