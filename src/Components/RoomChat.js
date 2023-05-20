import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../appContext";
import {
  Timestamp,
  arrayUnion,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import send from "../Images/send.svg";
import Messages from "./Messages";
import { v4 as uuid } from "uuid";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";
import cross from "../Images/cross.svg";
import direct from "../Images/direct.svg";

const RoomChat = () => {
  const [modal, setModal] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [text, setText] = useState("");
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

  const handleSubmit = async () => {
    await updateDoc(doc(db, "userRooms", roomID), {
      messages: arrayUnion({
        id: uuid(),
        text,
        senderId: user.uid,
        senderDisplayName: user.displayName,
        senderPhotoURL: user.photoURL,
        date: Timestamp.now(),
      }),
    });
    await updateDoc(doc(db, "userRooms", roomID), {
      ["lastMessage"]: { text },
      ["date"]: serverTimestamp(),
    });
  };

  return (
    <div>
      {modal && (
        <div className="modal">
          <div
            className="modalCross"
            onClick={() => {
              setModal(false);
            }}
          >
            <div>All Members</div>
            <img src={cross} alt="" />
          </div>
          <div>
            {messages?.users.map((item) => {
              return (
                <div className="memberMain">
                  <div>
                    <img src={item.photoURL} alt="" />
                  </div>
                  <div className="memDisplay">{item.id === user.uid ? '(Myself)' : <p>{item.displayName}</p>}</div>
                  {item.id !== user.uid && <div className="memPhoto">
                    <img src={direct} alt="" />
                  </div>}
                  
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="messagesMain">
        <div className="messageName">{messages?.roomName}</div>
        <div
          className="messageBTN"
          onClick={() => {
            navigator.clipboard.writeText(roomID);
          }}
        >
          Copy Link
        </div>
        <div
          className="messageBTN"
          onClick={() => {
            setModal(!modal);
          }}
        >
          All Members
        </div>
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
        <div onClick={() => handleSubmit()}>
          <img src={send} alt="" />
        </div>
      </div>
    </div>
  );
};

export default RoomChat;
