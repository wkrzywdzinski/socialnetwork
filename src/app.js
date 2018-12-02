import React from "react";
import axios from "./axios";
import Logo from "./logo";
import Profilepic from "./profilepic";
import Uploader from "./uploader";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploadervisable: false
        };
        this.showuploader = this.showuploader.bind(this);
        this.handlePicture = this.handlePicture.bind(this);
    }
    handlePicture(resp) {
        this.setState({
            pictureurl: resp.data[0].pictureurl
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
            </div>
        );
    }
}
