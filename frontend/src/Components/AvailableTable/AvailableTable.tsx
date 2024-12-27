import React, {useEffect, useState} from "react";
import EWeekday from "../../enums/EWeekday.ts";
import "./AvailableTable.css"
import PeriodBlock from "../PeriodBlock/PeriodBlock.tsx";


const AvailableTable: React.FC = () => {
    const [orderedWeekdays, setOrderedWeekdays] = useState<string[]>([]);

    const test = {
        names: "Name",
        surnames: "Surname"
    }
    const test2 = {
        color: "black",
        weight: 2
    }

    useEffect(() => {
        const reorderWeekdays = () => {
            const weekdays = Object.keys(EWeekday).filter(
                (key) => isNaN(Number(key)) // Exclude numeric keys
            );
            // Move Sunday to the end
            return [...weekdays.filter((day) => day !== "Sunday"), "Sunday"];
        };

        setOrderedWeekdays(reorderWeekdays());
    }, []);


    return (
        <table className="table table-dark table-striped text-center table-bordered border-white">
            <thead>
            <tr>
                <th>
                    Godzina
                </th>
                {orderedWeekdays.map((day) => (
                    <th key={day}>{day}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            <tr>
                <td className="p-0 align-content-center">
                    21:37
                </td>
                <td className="p-0">
                    <PeriodBlock color="blue" subjectName="Fajny przedmiot" roomNumber="2137" organizer={test} border={test2}/>
                </td>
                <td className="p-0">
                    <PeriodBlock color="green" subjectName="Fajny przedmiot2" roomNumber="2137" organizer={test} border={test2}/>
                </td>
                <td className="p-0">
                    <PeriodBlock color="white" subjectName="Fajny przedmiot3" roomNumber="2137" organizer={test} border={test2}/>
                </td>
                <td className="p-0">
                    <PeriodBlock color="white" subjectName="Fajny przedmiot3" roomNumber="2137" organizer={test} border={test2}/>
                    <PeriodBlock color="orange" subjectName="Jeszcze lepszy przedmiot" roomNumber="2137" organizer={test} border={test2}/>
                </td>
            </tr>
            </tbody>
        </table>
    );
};

export default AvailableTable;