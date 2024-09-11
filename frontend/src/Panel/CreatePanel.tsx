import React from "react";
import apiService from "../../services/apiService.tsx";

type User ={

}

const CreatePanel: React.FC = () => {
    console.log(apiService.getTestPerson())
    return (
        <>
            Tutaj będziemy robić se panelik do wbijania info
        </>
    );
};

export default CreatePanel;
