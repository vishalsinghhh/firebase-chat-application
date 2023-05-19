import React, { useState } from "react";
import plus from "../Images/plus.svg";
import create from "../Images/create.svg";
import join from "../Images/join.svg";
import cross from "../Images/cross.svg";

const Sidebar = ({ room }) => {
  const [modal, setModal] = useState(false);
  console.log(room);
  return (
    <div>
      {modal && (
        <div className="modal">
          <div className="modalMain">
            <div className="ModalHeading">
              Create or join room now
              <div onClick={()=>{setModal(false)}}>
                <img src={cross} alt="" />
              </div>
            </div>
            <div className="inputField">
              <div>
                <input type="text" placeholder="Enter Room Name..." />
              </div>
              <div>
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
          <div></div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
