import React from "react";
import axios from "./axios";
import Profilepic from "./profilepic";
import Request from "./request";

export default class OtherPersonProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        var self = this;
        axios
            .get("/other-user", {
                params: {
                    otherid: self.props.match.params.id
                }
            })
            .then(function(resp) {
                if (!resp.data[0] || resp.data.sameprofile) {
                    self.props.history.push("/");
                } else {
                    self.setState(resp.data[0]);
                }
            });
    }

    render() {
        return (
            <div id="profilebox">
                <h1> profile of {this.state.name} </h1>
                <Profilepic pictureurl={this.state.pictureurl} />
                {this.state.bio && <h1>bio: {this.state.bio} </h1>}
                <Request receiverid={this.props.match.params.id} />
            </div>
        );
    }
}
