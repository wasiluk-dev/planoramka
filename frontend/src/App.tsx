// src/App.jsx
// import {BrowserRouter as Route, Router, Routes} from 'react-router-dom';
// import NotFound from './NotFound';
import React from "react";
import Header from "./Header/Header.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./Login/Login.tsx";
import NotFound from "./NotFound.tsx";
import Home from "./Home/Home.tsx";
import Plans from "./Plans/Plans.tsx";

const App: React.FC = () => {
    return (
        <>
            <Header/>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home/>} />
                    <Route path='/plans' element={<Plans/>} />
                    <Route path='login' element={<Login/>} />
                    <Route path='*' element={<NotFound/>} />
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;
