import React, { useEffect, useState } from "react";

import APIService from "../../services/APIService.ts";
import { UserPopulated } from '../../services/DBTypes.ts';

const Login: React.FC = () =>{
    useEffect(() => {
        const button = document.getElementById('registerButton');
        const handleClick = () => {
            register();
        };

        button?.addEventListener('click', handleClick);

        return () => {
            button?.removeEventListener('click', handleClick);
        };
    }, []);

    let username: string | null = null;
    let password: string | null = null;

    // @ts-ignore
    const [registerData, setRegisterData] = useState<Pick<UserPopulated, 'username' | 'password' | 'fullName'>>({
        username: "",
        password: "",
    });

    const login = () => {
        const usernameElement = document.getElementById('username') as HTMLInputElement | null;
        const passwordElement = document.getElementById('password') as HTMLInputElement | null;

        // jeśli istnieje, to weź wartość name i pass
        if (usernameElement && usernameElement.value && passwordElement && passwordElement.value) {
            username = usernameElement.value;
            password = passwordElement.value;
        }

        console.log("Logowanie:");
        console.log(username);
        console.log(password);
    }

    const register = () => {
        const usernameElement = document.getElementById('username') as HTMLInputElement | null;
        const passwordElement = document.getElementById('password') as HTMLInputElement | null;
        const fullNameElement = document.getElementById('fullName') as HTMLInputElement | null;

        if (usernameElement?.value && passwordElement?.value && fullNameElement?.value) {
            const newRegisterData = {
                username: usernameElement.value,
                password: passwordElement.value,
                fullName: fullNameElement.value,
            };

            setRegisterData(prevState => {
                const updatedState = {...prevState, ...newRegisterData};
                APIService.createUser(updatedState);
                return updatedState;
            });
        } else {
            throw new Error("Błąd w rejestracji");
        }
    };

     return(<>
         <form>
             <label htmlFor="username">Login:</label><br/>
             <input type="text" id="username" name="username" /><br/>
             <label htmlFor="password">Hasło:</label><br/>
             <input type="password" id="password" name="password" /><br/>
             <label htmlFor="fullName">Imię i Nazwisko:</label><br/>
             <input type="text" id="fullName" name="fullName" /><br/>
             {/* <label htmlFor="email">Email:</label><br/> */}
             {/* <input type="email" id="email" name="email"/> */}
         </form>
         <button className='btn btn-info fw-medium' name='login' onClick={login}>Zaloguj się (Ten przycisk nic nie robi :) )</button>
         <button className='btn btn-success fw-medium' name='register' id="registerButton">Zarejestruj się</button>
     </>)
}

export default Login;
