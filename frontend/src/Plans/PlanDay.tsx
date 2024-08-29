import React from "react";


//zmienne, które przyjmuje ten komponent wraz z typami
interface PlanDayProps {
    day: string;
    // children: ReactNode;
}

const PlanDay: React.FC<PlanDayProps> = ({day}) => {
    return (
        <div className="not-found">
            <h1>{day}</h1>
        </div>
    );
};

export default PlanDay;