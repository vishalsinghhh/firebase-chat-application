import React, { useState, useEffect } from "react";
import plus from "../Images/plus.svg";
import create from "../Images/create.svg";
import join from "../Images/join.svg";
import cross from "../Images/cross.svg";
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
  onSnapshot,
} from "firebase/firestore";
import { db } from "../utils/firebase";

const Sidebar = () => {
  const [room, getRooms] = useState();
  const [chats, setChats] = useState([]);
  const [user, loading] = useAuthState(auth);
  const [modal, setModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  const handleSubmit = async () => {
    if (roomName === "") {
      return;
    }
    const docRef = await addDoc(collection(db, "userRooms"), {
      roomName: roomName,
      users: [{ id: user.uid }],
    });
    await getData();
    setModal(false);
  };
  const getData = async () => {
    if (user) {
      const q = query(
        collection(db, "userRooms"),
        where("users", "array-contains", { id: user.uid })
      );
      const docSnap = await getDocs(q);
      console.log(docSnap._snapshot.docChanges);
      getRooms(docSnap._snapshot.docChanges);
    }
  };
  if (room) {
    console.log(room[0]?.doc.data.value.mapValue.fields.roomName.stringValue);
  }

  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(db, "userChats", user.uid), (doc) => {
        setChats(doc.data());
      });
      return () => {
        unsub();
      };
    }
  }, [user]);
  console.log(chats);

  useEffect(() => {
    getData();
  }, [user]);
  return (
    <div>
      {modal && (
        <div className="modal">
          <div className="modalMain">
            <div className="ModalHeading">
              Create or join room now
              <div
                onClick={() => {
                  setModal(false);
                }}
              >
                <img src={cross} alt="" />
              </div>
            </div>
            <div className="inputField">
              <div>
                <input
                  type="text"
                  placeholder="Enter Room Name..."
                  onChange={(e) => {
                    setRoomName(e.target.value);
                  }}
                />
              </div>
              <div
                onClick={() => {
                  handleSubmit();
                }}
              >
                <img src={create} alt="" />
              </div>
            </div>
            <div className="or">OR</div>
            <div className="inputField">
              <div>
                <input type="text" placeholder="Enter Room Link..." />
              </div>
              <div>
                <img src={join} alt="" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="SidebarMain">
        {room?.length === 0 ? (
          <div className="sidebarNull">
            <div>
              <img
                src={plus}
                alt=""
                onClick={() => {
                  setModal(true);
                }}
              />
            </div>
            <div className="joinLetter">Create or Join Chat Rooms...</div>
          </div>
        ) : (
          <div>
            <div>Chat Rooms</div>
            {/* <div>
              <img
                src={plus}
                alt=""
                onClick={() => {
                  setModal(true);
                }}
              />
            </div> */}
            <div>
              {room?.map((_, index) => {
                return (
                  <div>
                    {
                      room[index].doc.data.value.mapValue.fields.roomName
                        .stringValue
                    }
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
