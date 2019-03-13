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
                <h2> profile of {this.state.name} </h2>
                <Profilepic pictureurl={this.state.pictureurl} />
                {this.state.bio && <p>bio: {this.state.bio} </p>}
                <Request receiverid={this.props.match.params.id} />
            </div>
        );
    }
}
