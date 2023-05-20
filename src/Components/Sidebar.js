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
  where,
  onSnapshot,
  updateDoc,
  arrayUnion,
  getDocs,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { useGlobalContext } from "../appContext";

const Sidebar = () => {
  const { getRoomID, changeScreenType } = useGlobalContext();
  const [room, getRooms] = useState();
  const [chats, setChats] = useState([]);
  const [user, loading] = useAuthState(auth);
  const [modal, setModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [link, setLink] = useState("");
  const handleSubmit = async () => {
    if (roomName === "") {
      return;
    }
    const docRef = await addDoc(collection(db, "userRooms"), {
      roomName: roomName,
      users: [
        {
          id: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
      ],
      messages: [],
      lastMessage: "",
    });
    await getData();
    setModal(false);
  };
  const handleJoin = async () => {
    await updateDoc(doc(db, "userRooms", link), {
      users: arrayUnion({
        id: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }),
    });
    await getData();
    setModal(false);
  };
  const getData = async () => {
    if (user) {
      const q = query(
        collection(db, "userRooms"),
        where("users", "array-contains", {
          id: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        })
      );
      
      onSnapshot(q, async(querySnapshot) => {
        // getRooms(querySnapshot._snapshot.docChanges);
        const employees = await getDocs(q);
        getRooms(employees._snapshot.docChanges)
      });
      const employees = await getDocs(q);
      
    }
  };

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

  useEffect(() => {
    getData();
  }, [user]);

  // ROOM
  const handleRoom = (data) => {
    getRoomID(data)
  };

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
                <input
                  type="text"
                  placeholder="Enter Room Link..."
                  onChange={(e) => {
                    setLink(e.target.value);
                  }}
                />
              </div>
              <div
                onClick={() => {
                  handleJoin();
                }}
              >
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
            <div className="chatRoomMain">
              <div className="chatRoom">Chat Rooms</div>
              <div>
                <img
                  src={plus}
                  alt=""
                  onClick={() => {
                    setModal(true);
                  }}
                />
              </div>
            </div>

            <div className="RoomsMain">
              {room?.map((_, index) => {
                return (
                  <div
                    onClick={() => {
                      changeScreenType('room')
                      {room[index].doc.key.path.segments[6] ? handleRoom(room[index].doc.key.path.segments[6]): handleRoom(room[index].doc.key.path.segments[1]);}
                      
                    }}
                    className="Rooms"
                  >
                  <div className="roomIndex">{index+1}</div>
                  <div className="MainName">{
                      room[index].doc.data.value.mapValue.fields.roomName
                        .stringValue
                    }</div>
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
