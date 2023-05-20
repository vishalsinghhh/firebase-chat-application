import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../appContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase";
import send from "../Images/send.svg"

const RoomChat = () => {
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
  console.log(messages);

  return (
    <div>
      <div className="messagesMain">
        <div className="messageName">{messages?.roomName}</div>
        <div className="messageBTN">Copy Link</div>
        <div className="messageBTN">All Members</div>
      </div>
      <div className="messageInputs">
        <input type="text" placeholder="Type Message Here..."/>
        <div><img src={send} alt="" /></div>
        
      </div>
    </div>
  );
};

export default RoomChat;
