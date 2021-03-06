import { useContext, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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
  const [error, setError] = useState("");

  const register = async () => {
    try {
      if (
        !registerDisplayname ||
        typeof registerDisplayname !== "string" ||
        registerDisplayname.trim() == ""
      ) {
        throw { message: "Username cannot be empty"};
      }

      let user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      await updateProfile(auth.currentUser, {
        displayName: registerDisplayname,
      });
      auth.currentUser.displayName = registerDisplayname;
      user = auth.currentUser;
      
      // console.log(user.localId)
      await addUser({
        variables: { userName: registerDisplayname, gid: user.uid },
      });
      setError("");
      window.location.reload(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const login = async () => {
    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      // console.log(user.uid);
      // console.log(user);
      setError("");
    } catch (error) {
      setError("Invalid email/password");
    }
  };

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      const additionalInfo = getAdditionalUserInfo(result);
      // console.log(credential);
      // console.log(additionalInfo);
      // console.log(result.user);
      // const token = credential.accessToken;
      setError("");
      const user = result.user;
      if (additionalInfo.isNewUser) {
        addUser({
          variables: { userName: user.displayName, gid: user.uid },
        });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (currentUser && currentUser.displayName) {
    return <Navigate to="/" />;
  }

  return (
    <div className="App">
      <br />
      {error && (
        <div>
          <h1>{error}</h1>
        </div>
      )}
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
          type="password"
          onChange={(event) => {
            setRegisterPassword(event.target.value);
          }}
        />

        <button onClick={register}>Create User</button>
        <br />
        <br />
        <div>
          <button onClick={googleLogin}>Register with Google</button>
        </div>
      </div>
      <br />
      <br />
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
          type="password"
          onChange={(event) => {
            setLoginPassword(event.target.value);
          }}
        />

        <button onClick={login}>Login</button>
        <br />
        <br />
        <div>
          <button onClick={googleLogin}>Login with Google</button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
