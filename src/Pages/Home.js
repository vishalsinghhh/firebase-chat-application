import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";
import { collection, addDoc, doc, query, getDoc, where, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";

const Home = () => {
  const [user, loading] = useAuthState(auth);
  const [roomName, setRoomName] = useState("");
  const handleSubmit = async () => {
    if (roomName === "") {
      return;
    }
    const docRef = await addDoc(collection(db, "userRooms"), {
      roomName: roomName,
      users: [{ id: user.uid }],
    });
  };

  const getData = async () => {
    const q = query(collection(db, "userRooms"), where(
        "users",
        "array-contains",
        { id: "vI0vpqYVulVXHWgqFKm6k5X2uWF2"}
      ))
    const docSnap = await getDocs(q);
    console.log(docSnap);
  };

  return (
    <div>
      <input
        type="text"
        value={roomName}
        onChange={(e) => {
          setRoomName(e.target.value);
        }}
      />
      <button
        onClick={() => {
          handleSubmit();
        }}
      >
        Create Room
      </button>
      <button
        onClick={() => {
          getData();
        }}
      >
        get Room
      </button>
    </div>
  );
};

export default Home;
