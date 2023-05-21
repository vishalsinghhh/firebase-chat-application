import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";

const Messages = ({ messages }) => {
  const [user, loading] = useAuthState(auth);
  return (
    <div>
      <div>
        {messages.senderId === user?.uid ? (
          <div className="myMessage1">
            <p>
              <span className="myMessageNew myMessageNew1">{messages.text}</span>
            </p>
          </div>
        ) : (
          <div className="myMessage2">
            <div className="DisplayName">
              <img src={messages.senderPhotoURL} alt="" />
              <div className="DisplayNameMain">{messages.senderDisplayName}</div>
            </div>
            <p>
              <span className="myMessageNew">{messages.text}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
