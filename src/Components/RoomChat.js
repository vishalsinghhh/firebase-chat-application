import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../appContext";
import { Timestamp, arrayUnion, doc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import send from "../Images/send.svg";
import Messages from "./Messages";
import {v4 as uuid} from "uuid"
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";

const RoomChat = () => {
  const [user, loading] = useAuthState(auth);
  const [text, setText] = useState('')
  const [messages, setMessages] = useState([]);
  const { roomID } = useGlobalContext();
  useEffect(() => {
    if (roomID) {
      const unsub = onSnapshot(doc(db, "userRooms", roomID), (doc) => {
        doc.exists() && setMessages(doc.data());
      });
    }

    //
  }, [roomID]);
  console.log(roomID);

  const handleSubmit=async()=>{
    await updateDoc(doc(db, "userRooms", roomID), {
      messages:arrayUnion({
        id:uuid(),
        text,
        senderId:user.uid,
        date:Timestamp.now()
      })
    })
    await updateDoc(doc(db, "userRooms", roomID),{
      ["lastMessage"]:{text},
      ["date"]:serverTimestamp()
    })
  }

  return (
    <div>
      <div className="messagesMain">
        <div className="messageName">{messages?.roomName}</div>
        <div className="messageBTN">Copy Link</div>
        <div className="messageBTN">All Members</div>
      </div>
      <div>
        {messages?.messages?.map((m) => (
          <Messages messages={m} />
        ))}
      </div>
      <div className="messageInputs">
        <input type="text" placeholder="Type Message Here..." onChange={(e)=>{setText(e.target.value)}}/>
        <div onClick={()=>handleSubmit()}>
          <img src={send} alt="" />
        </div>
      </div>
    </div>
  );
};

export default RoomChat;
