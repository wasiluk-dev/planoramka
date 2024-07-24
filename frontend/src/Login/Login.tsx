import React from "react";

const Login: React.FC = () =>{
    let ulogin: string | null = null;
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

    const register = () =>{
        const uloginElement = document.getElementById('login') as HTMLInputElement | null;
        const passElement = document.getElementById('pass') as HTMLInputElement | null;
        //jeśli istnieje to weź wartość name i pass
        if (uloginElement && uloginElement.value && passElement && passElement.value) {
            ulogin= uloginElement.value;
            pass= passElement.value;
        }
        console.log("Rejestracja:");
        console.log(ulogin);
        console.log(pass);
    }
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
         <button name='login' onClick={login}>Zaloguj się</button>
         <button name='register' onClick={register}>Zarejestruj się</button>
     </>
 )
}
export default Login;