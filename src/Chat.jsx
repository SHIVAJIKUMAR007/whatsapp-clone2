import React, { useState, useEffect } from "react";
import "./chat.css";
import { useParams } from "react-router-dom";
import { Avatar, IconButton } from "@material-ui/core";
import AttachFile from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import SendIcon from "@material-ui/icons/Send";
import MoodIcon from "@material-ui/icons/Mood";
import { db } from "./firebase";
import WelcomeChat from "./WelcomeChat";
import firebase from "firebase";

function Chat() {
  const [massage, setmassage] = useState([]);
  const [massageToSend, setmassageToSend] = useState("");
  const [room, setroom] = useState("");
  const { roomId } = useParams();

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => {
          setroom(snapshot.data().name);
        });

      db.collection("rooms")
        .doc(roomId)
        .collection("massage")
        .orderBy("time", "asc")
        .onSnapshot((snapshot) => {
          setmassage(
            snapshot.docs.map((doc) => {
              return doc.data();
            })
          );
        });
    }
  }, [roomId]);

  const localUser = JSON.parse(window.localStorage.getItem("user")).user;

  const sendMassage = (e) => {
    // to not refresh on submit
    e.preventDefault();
    db.collection("rooms").doc(roomId).collection("massage").add({
      email: localUser.email,
      name: localUser.displayName,
      massage: massageToSend,
      time: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setmassageToSend("");
  };

  return (
    <div className="chat">
      {/* chat header  */}
      <ChatHeader key="1" name={room} massage={massage} />
      {/* chat header end  */}

      <div className="chatBody">
        {roomId ? (
          <>
            {massage?.map((massage, i) => (
              <>
                <p
                  className={
                    massage.email === localUser.email
                      ? "receiverMassages my-4"
                      : "otherMassages my-4"
                  }
                >
                  <span className="massageName">{massage.name}</span>
                  <br />
                  {massage.massage + " "}
                  <span className="massageTime">
                    {new Date(massage.time?.toDate()).toUTCString()}
                  </span>
                </p>
              </>
            ))}
          </>
        ) : (
          <WelcomeChat />
        )}
      </div>

      <div className="massageBox row px-4">
        <IconButton>
          <MoodIcon />
        </IconButton>
        <IconButton>
          <AttachFile />
        </IconButton>
        <form
          action=""
          onSubmit={sendMassage}
          className="row massageForm mt-2"
          style={{ flex: "1" }}
        >
          <input
            type="text"
            name="Massage"
            placeholder="Type a massage"
            value={massageToSend}
            onChange={(e) => setmassageToSend(e.target.value)}
            className="form-control mx-auto"
            style={{ flex: "1", borderRadius: "5rem" }}
          />
          <IconButton onClick={sendMassage}>
            <SendIcon
              type="submit"
              style={{
                top: "-0.6rem",
              }}
            />
          </IconButton>
        </form>
      </div>
    </div>
  );
}

const ChatHeader = ({ name, massage }) => {
  return (
    <>
      <div className="chat_header">
        <Avatar src={`https://joeschmoe.io/api/v1/${name}`} />
        <div className="chat_headerInfo">
          <h4>{name}</h4>
          <p>
            {massage.length
              ? "  Last Seen at" +
                new Date(
                  massage[massage.length - 1]?.time.toDate()
                ).toUTCString()
              : "No massage till now"}
          </p>
        </div>
        <IconButton>
          <SearchIcon />
        </IconButton>

        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </div>
    </>
  );
};
export default Chat;
