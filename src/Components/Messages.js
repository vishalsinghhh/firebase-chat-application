import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";

const Messages = ({ messages }) => {
  const [user, loading] = useAuthState(auth);
  console.log(messages);
  return (
    <div>
      <div>
        {messages.senderId === user.uid ? (
          <div className="myMessage1"><p><span className="myMessageNew">{messages.text}</span></p></div>
        ) : (
          <div className="myMessage2"><p><span className="myMessageNew">{messages.text}</span></p></div>
        )}
      </div>
    </div>
  );
};

export default Messages;
