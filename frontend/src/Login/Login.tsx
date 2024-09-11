import React, {useEffect, useState} from "react";
import apiService from "../../services/apiService.tsx";

interface CreateUser{
    username:string;
    password:string;
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

        if (uloginElement?.value && passElement?.value) {
            const newRegisterData = {
                username: uloginElement.value,
                password: passElement.value,
            };

            setRegisterData(prevState => {
                const updatedState = {
                    ...prevState,
                    ...newRegisterData,
                };
                apiService.createUser(updatedState);
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
             <label htmlFor="name">Imię:</label><br/>
             <input type="text" id="name" name="name"/><br/>
             <label htmlFor="sname">Nazwisko:</label><br/>
             <input type="surname" id="sname" name="sname"/><br/>
             <label htmlFor="email">Email:</label><br/>
             <input type="email" id="email" name="email"/>
         </form>
         {/*<button name='login' onClick={login}>Zaloguj się</button>*/}
         <button name='register' id="registerButton">Zarejestruj się</button>
     </>
 )
}
export default Login;