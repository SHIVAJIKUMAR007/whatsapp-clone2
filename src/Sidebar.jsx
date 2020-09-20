import React, { useState, useEffect } from "react";
import "./sidebar.css";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import CommentIcon from "@material-ui/icons/Comment";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import { IconButton } from "@material-ui/core";
import { db } from "./firebase.js";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const [rooms, setrooms] = useState([]);
  const [searchFeild, setsearchFeild] = useState("");

  useEffect(() => {
    db.collection("rooms").onSnapshot((snapshot) =>
      setrooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
  }, []);

  const addNewRoom = () => {
    const room = prompt("Add new room");

    if (room) db.collection("rooms").add({ name: room });
  };

  return (
    <div className="sidebar" style={{ borderRight: "0.1rem solid black" }}>
      <SidebarHeader />

      {/* sidebar searchbox is  here  */}
      <div className="sidebar_searchBox m-3 px-3">
        <div
          className="row"
          style={{ border: "0.1rem solid black", borderRadius: "6rem" }}
        >
          <SearchIcon />
          <input
            type="text"
            name="searchBox"
            value={searchFeild}
            onChange={(e) => {
              setsearchFeild(e.target.value);
            }}
            placeholder="search a new chat room"
            style={{ width: "80%", outlineWidth: "0", border: "0" }}
          />
        </div>
      </div>
      {/* sidebar searchbox is ends here  */}

      {/* sidebar rooms is  here  */}

      <div className="sidebar_room">
        <h4 className="m-4" style={{ cursor: "pointer" }} onClick={addNewRoom}>
          Add a new Room
        </h4>
        {rooms.map((room) => (
          <Rooms key={room.id} id={room.id} name={room.data.name} />
        ))}
      </div>
    </div>
    //  sidebar rooms end here
  );
}

const Rooms = ({ id, name }) => {
  const [massage, setmassage] = useState([]);

  db.collection("rooms")
    .doc(id)
    .collection("massage")
    .orderBy("time", "desc")
    .onSnapshot((snapshot) => {
      setmassage(
        snapshot.docs.map((doc) => {
          return doc.data();
        })
      );
    });

  return (
    <>
      <NavLink to={`/${id}`} className="NavLink">
        <div className="m-4 row" id="rooms">
          <figure style={{ width: "20%" }}>
            <img src={`https://joeschmoe.io/api/v1/${name}`} alt="fi" />
          </figure>
          <div style={{ width: "80%", placeItems: "center" }}>
            <h6 className="pl-3">{name}</h6>
            <p className=" text-center">
              {massage.length ? massage[0]?.massage : "new room to chat"}
            </p>
          </div>
        </div>
      </NavLink>
    </>
  );
};

const SidebarHeader = () => {
  const localUser = JSON.parse(window.localStorage.getItem("user")).user;

  return (
    <div className="sidebar_header row px-5 mb-3">
      <div style={{ width: "20%" }}>
        <img
          src={localUser.photoURL}
          alt="avatar"
          style={{
            marginTop: "1rem",
            height: "2.5rem",
            width: "2.5rem",
            borderRadius: "50%",
          }}
        />
      </div>
      <div className="ml-auto row">
        <IconButton>
          <DonutLargeIcon className="icons" />
        </IconButton>
        <IconButton>
          <CommentIcon className="icons" />
        </IconButton>
        <IconButton>
          <MoreVertIcon className="icons" />
        </IconButton>
      </div>
    </div>
  );
};
export default Sidebar;
