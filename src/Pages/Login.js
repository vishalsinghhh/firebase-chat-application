import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";

const Login = () => {
  // sign in with google
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();
  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const docRef = doc(db, "users", result.user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          email: result.user.email,
        });
        await setDoc(doc(db, "userChats", result.user.uid),{})
      }
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div>
      <div className="loginMain">
        <button
          onClick={() => {
            googleLogin();
          }}
        >
          <FcGoogle className="FcGoogle" size={40}/>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
