import { doc, onSnapshot, updateDoc, arrayUnion, Timestamp, serverTimestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";
import send from "../Images/send.svg";
import Messages from "./Messages";
import { v4 as uuid } from "uuid";

const DirectChat = () => {
  const [chats, setChats] = useState([]);
  const [user, loading] = useAuthState(auth);
  const [text, setText] = useState("");
  const [chatID, setChatID] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(db, "userChats", user.uid), (doc) => {
        setChats(doc.data());
        
        
        if (Object.entries(doc.data())[0][0] === 'date' && Object.entries(doc.data())[1][0] === 'lastMessage'){
          setChatID(Object.entries(doc.data())[2][0]);
        }else if(Object.entries(doc.data())[0][0] === 'date' && Object.entries(doc.data())[2][0] === 'lastMessage'){
          setChatID(Object.entries(doc.data())[1][0]);
        }else{
          setChatID(Object.entries(doc.data())[0][0]);
        }
        console.log(chatID);
      });
      return () => {
        unsub();
      };
    }
  }, [user?.uid]);

  useEffect(() => {
    if (chatID) {
      const unSub = onSnapshot(doc(db, "chats", chatID), (doc) => {
        doc.exists() && setMessages(doc.data());
      });
      return () => {
        unSub();
      };
    }
  }, [chatID]);
  console.log(chatID);
  

  const handleSubmit = async () => {
    await updateDoc(doc(db, "chats", chatID), {
      messages: arrayUnion({
        id: uuid(),
        text,
        senderId: user.uid,
        senderDisplayName: user.displayName,
        senderPhotoURL: user.photoURL,
        date: Timestamp.now(),
      }),
    });
    await updateDoc(doc(db, "userChats", user.uid), {
      ["lastMessage"]: { text },
      ["date"]: serverTimestamp(),
    });
  };

  return (
    <div>
      <div className="messagesMain">
        {Object.entries(chats)?.map((chat) => {
          return (
            <div key={chat[0]}>
              <div>{chat[1]?.userInfo?.displayName}</div>
              <div>
                <img src={chat[1]?.userInfo?.photoURL} alt="" />
              </div>
            </div>
          );
        })}
      </div>
      <div className="messageMap">
        {messages?.messages?.map((m) => (
          <Messages messages={m} />
        ))}
      </div>
      <div className="messageInputs">
        <input
          type="text"
          placeholder="Type Message Here..."
            onChange={(e) => {
              setText(e.target.value);
            }}
        />
        <div onClick={()=>{handleSubmit()}}>
          <img src={send} alt="" />
        </div>
      </div>
    </div>
  );
};

export default DirectChat;