import React, { useEffect, useState } from 'react';
import APIService from '../../services/apiService.tsx';
import { useNavigate } from 'react-router-dom';
import { UserPopulated } from '../../services/databaseTypes.tsx';

const Login: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const button = document.getElementById('registerButton');
        const handleClick = () => register();

        button?.addEventListener('click', handleClick);
        return () => button?.removeEventListener('click', handleClick);
    }, []);

    const [registerData, setRegisterData] = useState<Pick<UserPopulated, 'username' | 'password' | 'fullName'>>({
        username: '',
        password: '',
        fullName: '',
    });

    const login = () => {
        const usernameInput = document.getElementById('username') as HTMLInputElement | null;
        const passwordInput = document.getElementById('password') as HTMLInputElement | null;

        if (usernameInput?.value && passwordInput?.value) {
            const loginData = {
                username: usernameInput.value,
                password: passwordInput.value,
            };

            setRegisterData(prevState => {
                const updatedState = { ...prevState, ...loginData };
                APIService.loginUser(updatedState).then(() => {
                    navigate('/');
                });

                return updatedState;
            });
        } else {
            throw new Error('Wystąpił błąd podczas logowania.');
        }
    }

    const register = () => {
        const usernameInput = document.getElementById('username') as HTMLInputElement | null;
        const passwordInput = document.getElementById('password') as HTMLInputElement | null;
        const fullNameInput = document.getElementById('fullName') as HTMLInputElement | null;

        if (usernameInput?.value && passwordInput?.value && fullNameInput?.value) {
            const newRegisterData = {
                username: usernameInput.value,
                password: passwordInput.value,
                fullName: fullNameInput.value,
            };

            setRegisterData(prevState => {
                const updatedState = { ...prevState, ...newRegisterData };
                APIService.registerUser(updatedState);
                return updatedState;
            });
        } else {
            throw new Error('Wystąpił błąd podczas rejestracji.');
        }
    };

    const logout = () => APIService.logoutUser();

    return(<>
        <form>
            <label htmlFor="username">Login:</label>
            <br/><input type="text" id="username" name="username"/>
            <br/><label htmlFor="password">Hasło:</label>
            <br/><input type="password" id="password" name="password"/>
            <br/><label htmlFor='fullName'>Imię (imiona) i nazwisko:</label>
            <br/><input type="text" id="fullName" name="fullName"/>
            {/*<br/><label htmlFor="email">Adres e-mail:</label>*/}
            {/*<br/><input type="email" id="email" name="email"/>*/}
        </form>
        <button className='btn btn-info fw-medium' name='login' onClick={ login }>Zaloguj</button>
        <button className='btn btn-success fw-medium' name='register' id='registerButton' onClick={ register }>Zarejestruj</button>
        <button className='btn btn-danger fw-medium' name='logout' id='logoutbutton' onClick={ logout }>Wyloguj</button>
    </>)
}

export default Login;
