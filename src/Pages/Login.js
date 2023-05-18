import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

const Login = () => {
  // sign in with google
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const googleProvider = new GoogleAuthProvider();
  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (user) {
      navigate("/");
    }else{
      navigate("/login");
    }
  }, [user]);

  return (
    <div>
      Login
      <div>
        <button
          onClick={() => {
            googleLogin();
          }}
        >
          <FcGoogle />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
