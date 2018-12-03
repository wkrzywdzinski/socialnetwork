import React from "react";
import Bio from "./bio";
import Profilepic from "./profilepic";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bioUpdateVisable: false
        };
        this.showBioUpdate = this.showBioUpdate.bind(this);
    }

    showBioUpdate() {
        if (this.state.bioUpdateVisable) {
            this.setState({
                bioUpdateVisable: false
            });
        } else {
            this.setState({
                bioUpdateVisable: true
            });
        }
    }

    render() {
        return (
            <div>
                <h1> profile of {this.props.name} </h1>
                <Profilepic pictureurl={this.props.pictureurl} />
                {this.props.bio && <p>{this.props.bio} </p>}
                <p onClick={this.showBioUpdate}>update your bio</p>
                {this.state.bioUpdateVisable && (
                    <Bio handleBio={this.props.handleBio} />
                )}
            </div>
        );
    }
}
