import React, { useEffect, useState } from "react";
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
} from "firebase/firestore";
import { db } from "../utils/firebase";
import Sidebar from "../Components/Sidebar";
import Chatting from "../Components/Chatting";
import "./index.css";

const Home = () => {
  return (
    <div className="HomeMain">
      <div className="sidebar">
        <Sidebar/>
      </div>
      <div className="Chatting">
        <Chatting />
      </div>
    </div>
  );
};

export default Home;
// <div>
//   <input
//     type="text"
//     value={roomName}
//     onChange={(e) => {
//       setRoomName(e.target.value);
//     }}
//   />
//   <button
//     onClick={() => {
//       handleSubmit();
//     }}
//   >
//     Create Room
//   </button>
//   <button
//     onClick={() => {
//       getData();
//     }}
//   >
//     get Room
//   </button>
// </div>
