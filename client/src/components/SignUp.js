import { useContext, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  getAdditionalUserInfo,
} from "firebase/auth";
import { updateProfile } from "firebase/auth";
import auth from "../firebase/Firebase";
import { AuthContext } from "../firebase/AuthContext";
import mutations from "../mutations";
import { useMutation } from "@apollo/client";
import { Navigate } from "react-router-dom";

function SignUp() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerDisplayname, setRegisterDisplayname] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const { currentUser } = useContext(AuthContext);
  const [addUser, mutResult] = useMutation(mutations.ADD_USER);

  const register = async () => {
    try {
      if (
        !registerDisplayname ||
        typeof registerDisplayname !== "string" ||
        registerDisplayname.trim() == ""
      ) {
        throw `No display name given`;
      }

      let user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      await updateProfile(auth.currentUser, {
        displayName: registerDisplayname,
      });
      user = auth.currentUser;
      // console.log(user.localId)
      addUser({
        variables: { userName: registerDisplayname, gid: user.uid },
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const login = async () => {
    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      console.log(user.uid);
      console.log(user);
    } catch (error) {
      console.log(error.message);
    }
  };

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      const additionalInfo = getAdditionalUserInfo(result);
      // console.log(credential);
      console.log(additionalInfo);
      console.log(result.user);

      // const token = credential.accessToken;
      const user = result.user;
      if (additionalInfo.isNewUser) {
        addUser({
          variables: { userName: user.displayName, gid: user.uid },
        });
      }
    } catch (error) {}
  };

  const logout = async () => {
    await signOut(auth);
  };

  if (currentUser) {
    return (
      <Navigate to="/" />
    )
  }

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

        <div>
          <button onClick={googleLogin}>Register with Google</button>
        </div>
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

        <div>
          <button onClick={googleLogin}>Login with Google</button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
