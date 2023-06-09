import {
  doc,
  onSnapshot,
  query,
  getDocs,
  collection,
  where,
  updateDoc,
  arrayUnion,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";
import send from "../Images/send.svg";
import Messages from "./Messages";
import { v4 as uuid } from "uuid";
import { useGlobalContext } from "../appContext";

const DirectChat = () => {
  const { otherUserID } = useGlobalContext();
  const [chats, setChats] = useState([]);
  const [user, loading] = useAuthState(auth);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [otherUser1, setOtherUser1] = useState(null)
  console.log(otherUserID);

  const getUserData = async () => {
    const q = query(collection(db, "users"), where("uid", "==", otherUserID));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      setOtherUser1(doc.data())
    });
  };
  useEffect(() => {getUserData()}, [otherUserID]);

  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(db, "userChats", otherUserID), (doc) => {
        setChats(doc.data());
        const data = Object.keys(doc.data());
        
      });
      return () => {
        unsub();
      };
    }
  }, [user?.uid, otherUserID]);

  useEffect(() => {
    if (otherUserID) {
      const newChatID = user.uid > otherUserID
      ? user.uid + otherUserID
      : otherUserID + user.uid
      const unSub = onSnapshot(doc(db, "chats", newChatID), (doc) => {
        doc.exists() && setMessages(doc.data());
      });
      return () => {
        unSub();
      };
    }
  }, [ otherUserID]);

  const handleSubmit = async () => {
    const newChatID = user.uid > otherUserID
      ? user.uid + otherUserID
      : otherUserID + user.uid
    await updateDoc(doc(db, "chats", newChatID), {
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
      [newChatID + ".lastMessage"]: { text },
      [newChatID + ".date"]: serverTimestamp(),
    });
    await updateDoc(doc(db, "userChats", otherUserID), {
      [newChatID + ".lastMessage"]: { text },
      [newChatID + ".date"]: serverTimestamp(),
    });
    setText("")
  };
  console.log(otherUser1);

  return (
    <div>
      <div className="messagesMain">
        {/* {Object.entries(otherUser1)?.map((chat) => {
          return ( */}
            <div className="displayMain">
              <div>
                <img src={otherUser1?.photoURL} alt="" />
              </div>
              <div>{otherUser1?.displayName}</div>
            </div>
          {/* );
        })} */}
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
          value={text}
        />
        <div
          onClick={() => {
            handleSubmit();
          }}
        >
          <img src={send} alt="" />
        </div>
      </div>
    </div>
  );
};

export default DirectChat;
