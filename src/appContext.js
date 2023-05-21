import React, { useState, useContext, useEffect } from "react";
import { useCallback } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "./utils/firebase";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [roomID, setRoomID] = useState()
  const [screenType, setScreenType] = useState('empty')
  const [otherUserID, setOtherUserID] = useState(null)

  const getRoomID = async (currentUser)=>{
    setRoomID(currentUser)
  }

  const changeScreenType = async (currentUser)=>{
    setScreenType(currentUser);
    console.log(currentUser);
  }
  const getOtherUserID = async(currentUser)=>{
    setOtherUserID(currentUser)
  }
    
    return (
      <AppContext.Provider
        value={{getRoomID,changeScreenType,otherUserID,  roomID, screenType, getOtherUserID}}
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