import React from "react";
import axios from "./axios";
import Logo from "./logo";
import Profile from "./profile";
import Profilepic from "./profilepic";
import Uploader from "./uploader";
import { BrowserRouter, Route } from "react-router-dom";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploadervisable: false
        };
        this.showuploader = this.showuploader.bind(this);
        this.handlePicture = this.handlePicture.bind(this);
        this.handleBio = this.handleBio.bind(this);
    }
    handlePicture(resp) {
        this.setState({
            pictureurl: resp.data[0].pictureurl,
            uploadervisable: false
        });
    }
    handleBio(resp) {
        this.setState({
            bio: resp.data[0].bio
        });
    }
    showuploader() {
        if (this.state.uploadervisable) {
            this.setState({
                uploadervisable: false
            });
        } else
            this.setState({
                uploadervisable: true
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
                <Logo />
                <Profilepic
                    name={this.state.name}
                    pictureurl={this.state.pictureurl}
                    showuploader={this.showuploader}
                />
                {this.state.uploadervisable && (
                    <Uploader handlePicture={this.handlePicture} />
                )}
                <BrowserRouter>
                    <div>
                        <Route
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
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
