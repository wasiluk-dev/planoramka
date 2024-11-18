import React, {useEffect, useState} from "react";
import apiService from "../../services/apiService.tsx";
import {useNavigate} from "react-router-dom";

interface CreateUser{
    username:string;
    password:string;
    fullname:string;
}

const Login: React.FC = () =>{


    const navigate = useNavigate();

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




    // @ts-ignore
    const [registerData, setRegisterData] = useState<CreateUser>({
        username: "",
        password: "",
    });

    const login = () => {
        const uloginElement = document.getElementById('login') as HTMLInputElement | null;
        const passElement = document.getElementById('pass') as HTMLInputElement | null;
        //jeśli istnieje to weź wartość name i pass
        if (uloginElement && uloginElement.value && passElement && passElement.value) {
            const loginData = {
                username: uloginElement.value,
                password: passElement.value,
            };
            setRegisterData(prevState => {
                const updatedState = {
                    ...prevState,
                    ...loginData,
                };
                apiService.loginUser(updatedState).then(r => {
                    if (r){
                        navigate('/');
                    }
                });
                return updatedState;
            });
        }else {
            throw new Error("Błąd w logowaniou");
        }
        console.log(document.cookie)
    }

    const register = () => {
        const uloginElement = document.getElementById('login') as HTMLInputElement | null;
        const passElement = document.getElementById('pass') as HTMLInputElement | null;
        const fullnameElement = document.getElementById('fullname') as HTMLInputElement | null;

        if (uloginElement?.value && passElement?.value && fullnameElement?.value) {
            const newRegisterData = {
                username: uloginElement.value,
                password: passElement.value,
                fullname: fullnameElement.value,
            };

            setRegisterData(prevState => {
                const updatedState = {
                    ...prevState,
                    ...newRegisterData,
                };
                apiService.createUser(updatedState)
                return updatedState;
            });
        } else {
            throw new Error("Błąd w rejestracji");
        }
    };


    const logout = () => {
                apiService.logoutUser()
    }

 return(
     <>
         <form>
             <label htmlFor="login">Login:</label><br/>
             <input type="text" id="login" name="login"/><br/>
             <label htmlFor="pass">Hasło:</label><br/>
             <input type="password" id="pass" name="pass"/><br/>
             <label htmlFor="fullname">Imię i Nazwisko:</label><br/>
             <input type="text" id="fullname" name="fullname"/><br/>
             {/*<label htmlFor="email">Email:</label><br/>*/}
             {/*<input type="email" id="email" name="email"/>*/}
         </form>
         <button className='btn btn-info fw-medium' name='login' onClick={login}>Zaloguj się</button>
         <button className='btn btn-success fw-medium' name='register' id="registerButton" onClick={register}>Zarejestruj się</button>
         <button className='btn btn-danger fw-medium' name='logout' id="logoutbutton" onClick={logout}>Wyloguj</button>

     </>
 )
}
export default Login;