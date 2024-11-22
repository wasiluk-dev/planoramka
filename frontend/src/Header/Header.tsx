import  './Header.css'
import React from "react";

const Header: React.FC = () => {
    return(
        <div className="header">
            <a href='/'>Strona główna</a>
            <div className="headerSites">
                <div className="block">
                    <a href='/rdy'>Test Plan</a>
                </div>
                <div className="block">
                    <a href='/login'>Zaloguj się</a>
                </div>
                <div className="block">
                    <a href='/plans'>Test Kreator</a>
                </div>
                <div className="block">
                    <a href='/create'>Creation Panel</a>
                </div>
                <div className="block">
                    <a href='/profile'>Profil usera</a>
                </div>
            </div>
        </div>
    );
}

export default Header;