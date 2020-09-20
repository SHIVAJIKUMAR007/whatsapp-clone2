import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import { Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import img from "./images/logo.svg";
import { auth, provider } from "./firebase";

function App() {
  const localUser = window.localStorage.getItem("user");
  const [user, setuser] = useState(localUser);

  const signin = () => {
    auth
      .signInWithPopup(provider)
      .then((userData) => {
        window.localStorage.setItem("user", JSON.stringify(userData));
        let users = window.localStorage.getItem("user");
        setuser(users);
      })
      .catch((err) => console.log(err.massage));
  };

  return (
    <>
      {user ? (
        <div className="container whatsappBody ">
          <div className="row whatsappBodyRow d-flex flex-row">
            <Sidebar />
            {/* <Router> */}
            <Switch>
              <Route exact path="/:roomId" component={Chat} />
              <Route exact path="/" component={Chat} />
            </Switch>
            {/* </Router> */}
          </div>
        </div>
      ) : (
        <Login key="1" signin={signin} />
      )}
    </>
  );
}

const Login = ({ signin }) => {
  return (
    <>
      <div className="container mainDivLogin">
        <div className="centerDiv">
          <center>
            <img src={img} alt="img" />
          </center>
          <h4 className="text-center mb-4">sign in with google</h4>
          <center>
            <button className=" btn btn-success" onClick={signin}>
              sign in with google
            </button>
          </center>
        </div>
      </div>
    </>
  );
};

export default App;
