import React from "react";
import axios from "./axios";
import Profilepic from "./profilepic";

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
                console.log(resp);
                if (!resp.data[0] || resp.data.sameprofile) {
                    self.props.history.push("/");
                } else {
                    self.setState(resp.data[0]);
                    console.log(self.state);
                }
            });
    }

    render() {
        return (
            <div>
                <h1> profile of {this.state.name} </h1>
                <Profilepic pictureurl={this.state.pictureurl} />
                {this.state.bio && <h1>bio: {this.state.bio} </h1>}
            </div>
        );
    }
}
