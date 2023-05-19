import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../appContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase";

const RoomChat = () => {
  const [messages, setMessages] = useState([]);
  const { roomID } = useGlobalContext();
  useEffect(() => {
    if(roomID){
        const unsub = onSnapshot(doc(db, "userRooms", roomID), (doc) => {
            console.log(doc.data());
        });
    }
    
    // console.log(unSub);
  }, [roomID]);

  return <div>RoomChat</div>;
};

export default RoomChat;
