import React from "react";
import plus from "../Images/plus.svg";

const Sidebar = ({ room }) => {
  console.log(room);
  return (
    <div>
      <div className="SidebarMain">
        {room?.length === 0 ? (
          <div className="sidebarNull">
            <div>
              <img src={plus} alt="" />
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
