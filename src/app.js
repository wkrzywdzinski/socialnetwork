import React from "react";
import axios from "./axios";
import EasyTransition from "react-easy-transition";
import Profile from "./profile";
import Profilepic from "./profilepic";
import Friends from "./friends";
import Uploader from "./uploader";
import Online from "./online";
import Chat from "./chat";
import Search from "./search";
import OtherPersonProfile from "./otherpersonprofile";
import { BrowserRouter, Route } from "react-router-dom";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploadervisable: false
        };
        this.showUploader = this.showUploader.bind(this);
        this.handlePicture = this.handlePicture.bind(this);
        this.handleBio = this.handleBio.bind(this);
    }
    handlePicture(resp) {
        this.setState({
            pictureurl: resp.data[0].pictureurl,
            uploaderVisable: false
        });
    }
    handleBio(resp) {
        this.setState({
            bio: resp.data[0].bio
        });
    }
    showUploader() {
        if (this.state.uploaderVisable) {
            this.setState({
                uploaderVisable: false
            });
        } else
            this.setState({
                uploaderVisable: true
            });
    }
    componentDidMount() {
        var self = this;
        axios.get("/user").then(function(resp) {
            self.setState(resp.data[0]);
        });
    }
    render() {
        return (
            <div>
                <div id="header">
                    <Profilepic
                        name={this.state.name}
                        pictureurl={this.state.pictureurl}
                        showuploader={this.showUploader}
                    />
                    <p id="headerfont">POLKA DOT CLUB</p>
                </div>
                {this.state.uploaderVisable && (
                    <EasyTransition
                        path={location.pathname}
                        initialStyle={{ opacity: 0, background: "red" }}
                        transition="opacity 0.3s ease-in, background 0.5s ease-in"
                        finalStyle={{ opacity: 0.9, background: "white" }}
                    >
                        <Uploader handlePicture={this.handlePicture} />
                    </EasyTransition>
                )}
                <BrowserRouter>
                    <div>
                        <Search />
                        <Route
                            exact
                            path="/profile"
                            render={() => {
                                return (
                                    <Profile
                                        handleBio={this.handleBio}
                                        name={this.state.name}
                                        pictureurl={this.state.pictureurl}
                                        bio={this.state.bio}
                                    />
                                );
                            }}
                        />
                        <Route
                            exact
                            path="/"
                            render={() => {
                                return (
                                    <Profile
                                        handleBio={this.handleBio}
                                        name={this.state.name}
                                        pictureurl={this.state.pictureurl}
                                        bio={this.state.bio}
                                    />
                                );
                            }}
                        />

                        <Route
                            exact
                            path="/friends"
                            render={() => {
                                return <Friends />;
                            }}
                        />
                        <Route
                            exact
                            path="/chat"
                            render={() => {
                                return <Chat />;
                            }}
                        />
                        <Route
                            exact
                            path="/online"
                            render={() => {
                                return <Online />;
                            }}
                        />
                        <Route
                            path="/user/:id"
                            render={props => (
                                <OtherPersonProfile
                                    {...props}
                                    key={props.match.url}
                                />
                            )}
                        />
                    </div>
                </BrowserRouter>
                <footer />
            </div>
        );
    }
}
