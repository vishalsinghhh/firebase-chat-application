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

const Chatting = () => {
  const { screenType } = useGlobalContext();
  const [user, loading] = useAuthState(auth);
  const [otherUser, setOtherUser] = useState(null);

  const getOtherUser = async () => {
    const q = query(
      collection(db, "users"),
      where("uid", "==", "gg5CJzyTiMc5aRZUxREvoFsU0Kh2")
    );
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setOtherUser(doc.data());
      });
    } catch (error) {}
  };

  const handleSelect = async () => {
    // Check whether the chat exists or not
    const combinedId =
      user.uid > otherUser.uid
        ? user.uid + otherUser.uid
        : otherUser.uid + user.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: otherUser.uid,
            displayName: otherUser.displayName,
            photoURL: otherUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", otherUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      console.log(error);
    }

    // create user chats
  };

  useEffect(() => {
    getOtherUser();
  }, []);

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
    </div>
  );
};

export default Chatting;
