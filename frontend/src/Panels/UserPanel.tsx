import React, {useEffect, useState} from "react";
import './panel.css'

const CreatePanel: React.FC = () => {

    return (
        <div className="d-flex w-100 text-center">
            <div className="bg-success ms-auto me-auto w-15">
                Lewo
            </div>
            <div className="bg-danger ms-auto me-auto w-85">
                Prawo
            </div>
        </div>
    );
};

export default CreatePanel;
