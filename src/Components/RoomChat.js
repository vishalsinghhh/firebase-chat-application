import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../appContext";
import {
  Timestamp,
  arrayUnion,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  getDoc,
  setDoc,
  query,
  collection,
  where,
  getDocs,
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
  // const [otherUser, setOtherUser] = useState(null);
  const [modal, setModal] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const { roomID, changeScreenType, getOtherUserID } = useGlobalContext();
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

  const handleSelect = async (userID) => {
    // Check whether the chat exists or not

    const q = query(collection(db, "users"), where("uid", "==", userID));
    let otherUser = null
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        otherUser = doc.data()
        console.log(doc.data());
      });
    } catch (error) {
      console.log(error);
    }
    
    
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
                  <div className="memDisplay">
                    {item.id === user.uid ? (
                      "(Myself)"
                    ) : (
                      <p>{item.displayName}</p>
                    )}
                  </div>
                  {item.id !== user.uid && (
                    <div
                      className="memPhoto"
                      onClick={() => {
                        changeScreenType("direct");
                        handleSelect(item.id);
                        getOtherUserID(item.id)
                      }}
                    >
                      <img src={direct} alt="" />
                    </div>
                  )}
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
