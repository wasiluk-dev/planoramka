import React from "react";

const Login: React.FC = () =>{
    let name: string | null = null;
    let pass: string | null = null;

    const login = () => {
        const nameElement = document.getElementById('name') as HTMLInputElement | null;
        const passElement = document.getElementById('pass') as HTMLInputElement | null;
        if (nameElement && nameElement.value && passElement && passElement.value) {
            name= nameElement.value;
            pass= passElement.value;
        }
        console.log(name);
        console.log(pass);
    }

    const register = () =>{
        console.log("Zarejestrowałeś się mordo");
    }
 return(
     <>
         <form>
             <label htmlFor="name">Login:</label><br/>
             <input type="text" id="name" name="name"/><br/>
             <label htmlFor="lname">Hasło:</label><br/>
             <input type="password" id="pass" name="pass"/>
         </form>
         <button name='login' onClick={login}>Zaloguj się</button>
         <button name='register' onClick={register}>Zarejestruj się</button>
     </>
 )
}
export default Login;