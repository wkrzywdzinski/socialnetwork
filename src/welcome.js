import React from "react";
import Registration from "./register";
import Login from "./login";
import { HashRouter, Route } from "react-router-dom";
export default function Welcome() {
    //////export
    return (
        <div className="welcomebox">
            <h1>Welcome to polka dot society</h1>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
////functional compo vs class
//// function capital letter, small letter html
