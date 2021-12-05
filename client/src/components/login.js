import React from "react";
import {getAuth, setPersistence, signInWithRedirect, browserSessionPersistence, GoogleAuthProvider } from "firebase/auth";

const login = () => {
    function GoogleLogin() {
        const auth = getAuth();
        setPersistence(auth, browserSessionPersistence).then(() => {
                let provider = GoogleAuthProvider();
                return signInWithRedirect(auth, provider);
        })
    }

    return (
        <div>
            <button onClick={()=> GoogleLogin()}>Sign In With Google</button>
        </div>
    )
}

export default login;