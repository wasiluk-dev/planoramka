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
        <div className="text-black cell-content perioddiv d-grid p-1"
            style={{
                backgroundColor: props.color
            }}>
            <div className="fw-bold">
                    {props.subjectName}
            </div>
            <div className="">
                {props.roomNumber}, {props.organizer.names + " " + props.organizer.surnames}
            </div>

        </div>
    );
}
export default PeriodBlock;