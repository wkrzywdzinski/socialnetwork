import React from "react";
import axios from "./axios";
import { BrowserRouter, Route } from "react-router-dom";
import Profile from "./profile";
import Profilepic from "./profilepic";
import Friends from "./friends";
import Uploader from "./uploader";
import Online from "./online";
import Chat from "./chat";
import Search from "./search";
import OtherPersonProfile from "./otherpersonprofile";

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
                <header>
                    <Profilepic
                        pictureurl={this.state.pictureurl}
                        showuploader={this.showUploader}
                    />
                    <p>POLKA DOT SOCIETY</p>
                </header>
                {this.state.uploaderVisable && (
                    <Uploader handlePicture={this.handlePicture} />
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
            </div>
        );
    }
}
