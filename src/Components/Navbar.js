import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  console.log(user);
  const logout = async () => {
    await signOut(auth);
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
      Navbar
      <button onClick={()=>{logout()}}>Logout</button>
    </div>
  );
};

export default Navbar;
