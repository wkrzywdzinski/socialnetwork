import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";

let component;
////////render should be called once//////
if (location.pathname === "/welcome") {
    component = <Welcome />;
} else {
    component = <App />;
}
ReactDOM.render(component, document.querySelector("main"));
