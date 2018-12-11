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
            <div id="profilebox">
                <h1> profile of {this.props.name} </h1>
                <Profilepic pictureurl={this.props.pictureurl} />
                {this.props.bio && <p>bio: {this.props.bio} </p>}
                <p onClick={this.showBioUpdate}>[update your bio]</p>
                {this.state.bioUpdateVisable && (
                    <Bio
                        bio={this.props.bio}
                        handleBio={this.props.handleBio}
                        showBioUpdate={this.showBioUpdate}
                    />
                )}
            </div>
        );
    }
}
