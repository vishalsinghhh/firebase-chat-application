import React, { useEffect, useState } from "react";
import logo from "../Images/logo.svg";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";
import {
  collection,
  addDoc,
  doc,
  query,
  getDoc,
  where,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import RoomChat from "./RoomChat";
import { useGlobalContext } from "../appContext";
import DirectChat from "./DirectChat";

const Chatting = () => {
  const { screenType } = useGlobalContext();
  const [user, loading] = useAuthState(auth);
  const [otherUser, setOtherUser] = useState(null);

  return (
    <div>
    
      {screenType === "empty" && (
        <div className="ChattingMain">
          <div>
            <img src={logo} alt="" />
          </div>
          {/* <button
            onClick={() => {
              handleSelect();
            }}
          >
            click
          </button> */}
          <div className="joinLetter">Connect. Chat. Collaborate.</div>
        </div>
      )}
      {screenType === "room" && (
        <div>
          <RoomChat />
        </div>
      )}
      {screenType === "direct" && (
        <div>
          <DirectChat />
        </div>
      )}
    </div>
  );
};

export default Chatting;
