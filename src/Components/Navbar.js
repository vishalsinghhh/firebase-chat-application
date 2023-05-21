import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logout1 from "../Images/logout.svg";
import "./index.css";
import hero from "../Images/hero.png";

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
    } else {
      navigate("/login");
    }
  }, [user]);

  return (
    <div className="NavbarMain1">
      {user ? (
        <div>
          <div className="navbarMain">
            <div className="navbarTitle">
              CI<span className="green">AO</span>
            </div>
            <div className="Navbar1">
              <div className="NavbarName">{user?.displayName}</div>
              <div className="NavbarLogo">
                <img src={user?.photoURL} alt="" />
              </div>
              <div
                className="logoutBTN"
                onClick={() => {
                  logout();
                }}
              >
                <img src={logout1} alt="" />
              </div>
            </div>
          </div>
          <div className="underline"></div>
        </div>
      ) : (
        <div>
          <div className="logoutNav">
            <div>
              CI<span className="green">AO</span>
            </div>

            <div>
              <img src={hero} alt="" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
