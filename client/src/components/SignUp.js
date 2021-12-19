import { useContext, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { updateProfile } from "firebase/auth";
import auth from "../firebase/Firebase";
import { AuthContext } from "../firebase/AuthContext";

function SignUp() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerDisplayname, setRegisterDisplayname] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const { currentUser } = useContext(AuthContext);

  const register = async () => {
    try {
      let user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      await updateProfile(auth.currentUser, {
        displayName: registerDisplayname,
      });
      user = auth.currentUser;
      console.log(currentUser);
    } catch (error) {
      console.log(error.message);
    }
  };

  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      console.log(currentUser.displayName);
    } catch (error) {
      console.log(error.message);
    }
  };

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log(currentUser);
    } catch (error) {}
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div className="App">
      <div>
        <h3> Register User </h3>
        <input
          placeholder="Username..."
          onChange={(event) => {
            setRegisterDisplayname(event.target.value);
          }}
        />
        <input
          placeholder="Email..."
          onChange={(event) => {
            setRegisterEmail(event.target.value);
          }}
        />
        <input
          placeholder="Password..."
          onChange={(event) => {
            setRegisterPassword(event.target.value);
          }}
        />

        <button onClick={register}>Create User</button>
      </div>
      <div>
        <button onClick={googleLogin}>Google</button>
      </div>
      <div>
        <h3> Login </h3>
        <input
          placeholder="Email..."
          onChange={(event) => {
            setLoginEmail(event.target.value);
          }}
        />
        <input
          placeholder="Password..."
          onChange={(event) => {
            setLoginPassword(event.target.value);
          }}
        />

        <button onClick={login}>Login</button>
      </div>
      {currentUser ? (
        <div>
          <h4> User Logged In: {currentUser.displayName} </h4>{" "}
          <button onClick={logout}> Sign Out </button>
        </div>
      ) : (
        <h4>No user logged in</h4>
      )}
    </div>
  );
}

export default SignUp;
