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
                <h2>{this.props.name}</h2>
                <Profilepic pictureurl={this.props.pictureurl} />
                <p>{this.props.bio}</p>
                <p id="updatefont" onClick={this.showBioUpdate}>
                    [update bio]
                </p>
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
