import React, {useEffect, useState} from "react";
import APIService from "../../services/APIService.ts";

interface CreateUser{
    name:string;
    password:string;
    fullname:string;
}

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




    let ulogin: string | null = null;
    // @ts-ignore
    const [registerData, setRegisterData] = useState<CreateUser>({
        username: "",
        password: "",
    });
    let pass: string | null = null;

    const login = () => {
        const uloginElement = document.getElementById('login') as HTMLInputElement | null;
        const passElement = document.getElementById('pass') as HTMLInputElement | null;
        //jeśli istnieje to weź wartość name i pass
        if (uloginElement && uloginElement.value && passElement && passElement.value) {
            ulogin= uloginElement.value;
            pass= passElement.value;
        }
        console.log("Logowanie:");
        console.log(ulogin);
        console.log(pass);
    }

    const register = () => {
        const uloginElement = document.getElementById('login') as HTMLInputElement | null;
        const passElement = document.getElementById('pass') as HTMLInputElement | null;
        const fullnameElement = document.getElementById('fullname') as HTMLInputElement | null;

        if (uloginElement?.value && passElement?.value && fullnameElement?.value) {
            const newRegisterData = {
                name: uloginElement.value,
                password: passElement.value,
                fullname: fullnameElement.value,
            };

            setRegisterData(prevState => {
                const updatedState = {
                    ...prevState,
                    ...newRegisterData,
                };
                APIService.createUser(updatedState);
                return updatedState;
            });
        } else {
            throw new Error("Błąd w rejestracji");
        }
    };

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
         <button className='btn btn-info fw-medium' name='login' onClick={login}>Zaloguj się (Ten przycisk nic nie robi :) )</button>
         <button className='btn btn-success fw-medium' name='register' id="registerButton">Zarejestruj się</button>
     </>
 )
}
export default Login;