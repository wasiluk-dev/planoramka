import './PeriodBlock.css'
import React from "react";

type PeriodBlockProps = {
    color: string;
    subjectName: string;
    organizer: {
        names: string;
        surnames: string;
    },
    roomNumber: string;
}

const PeriodBlock: React.FC<PeriodBlockProps> = (props: PeriodBlockProps) => {
    return(
        <div className="text-black cell-content perioddiv d-grid"
            style={{
                backgroundColor: props.color
            }}>
            <div className="fw-bold">
                    {props.subjectName}
            </div>
            <div className="mb-2">
                {props.roomNumber}, {props.organizer.names + " " + props.organizer.surnames}
            </div>

        </div>
    );
}
export default PeriodBlock;