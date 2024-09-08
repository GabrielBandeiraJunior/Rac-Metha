import React from "react";
import Login from "./Login";
import Register from './Register.js'

function PaginaRegistrar () {
  return (
    <div className="MainContainer"> {/* Contêiner principal */}
      <div className="Container">
        <Login />
      </div>
      <div className="Container">
        <Register />
      </div>
    </div>
  );
}

export default PaginaRegistrar;
