import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import reducer from "./reducers";
const store = createStore(reducer, applyMiddleware(reduxPromise));

let component;
////////render should be called once//////
if (location.pathname === "/welcome") {
    component = <Welcome />;
} else {
    component = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}
ReactDOM.render(component, document.querySelector("main"));
