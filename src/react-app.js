import App from "./app/App.js";
import React from "react";
import ReactDOM from "react-dom";

function init () {
    ReactDOM.render(<App/>, document.getElementById("app"));
}

if (["complete", "loaded", "interactive"].includes(document.readyState) && document.body) {
    init();
} else {
    window.addEventListener("DOMContentLoaded", init, false);
}