import React, {useState} from "react";
import './plans.css'
import PlanDay from "./PlanDay.tsx";
import GridComponent from "./GridComponent.tsx";
import apiService from "../../services/apiService.tsx";


interface User{
    _id:number;
    username:string;
    password:string;
    type: number;
    __v: number;
}

const Plans: React.FC = () =>{
    const [userData, setUserData] = useState<User | undefined>(undefined);
    const [state, setState] = useState<string>("Loading");
    let hoursStart: Array<string>;
    // let hoursEnd: Array<string>;
    hoursStart = ['8:00', '8:45']
    // hoursEnd = ['8:45', '9:30']
    const createNet = (): void => {
        let i:number = hoursStart.length;

        console.log('Essa')
    }
createNet();

    const getUserData = async () => {
        try {
            const fetchedUserData = await apiService.getTestPerson()
            console.log(fetchedUserData)
            return fetchedUserData;
        } catch (error) {
            // Handle error if needed
            console.error("Error fetching user data", error);
            return undefined;
        }
    };
    getUserData();
    return(
        <div className="plansGrid" id="plansGrid">
            <div className="titleGrid time">
                Godzina:
            </div>
            <div className="titleGrid day">
                Poniedziałek
            </div>
            <div className="titleGrid day">
                Wtorek
            </div>
            <div className="titleGrid day">
                Środa
            </div>
            <div className="titleGrid day">
                Czwartek
            </div>
            <div className="titleGrid day">
                Piątek
            </div>
            <div className="titleGrid day">
                Sobota
            </div>
            <div className="titleGrid day">
                Niedziela
            </div>
            <div className="titleGrid faculty">
                Faculties
            </div>
            {/*<p><PlanDay day='Test'/></p>*/}
            <GridComponent rows={hoursStart.length}/>
        </div>
    )
}
export default Plans;