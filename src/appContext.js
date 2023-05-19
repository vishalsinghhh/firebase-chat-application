import React, { useState, useContext, useEffect } from "react";
import { useCallback } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "./utils/firebase";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [roomID, setRoomID] = useState()

  const getRoomID = async (currentUser)=>{
    setRoomID(currentUser)
  }
    
    return (
      <AppContext.Provider
        value={{getRoomID, roomID}}
      >
        {children}
      </AppContext.Provider>
    );
  };
  // make sure use
  export const useGlobalContext = () => {
    return useContext(AppContext);
  };
  
  export { AppContext, AppProvider };