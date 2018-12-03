import React from "react";
import axios from "./axios";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bioUpdateVisable: false
        };
        this.showBioUpdate = this.showBioUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    showBioUpdate() {
        this.setState({
            bioUpdateVisable: true
        });
    }
    handleChange(e) {
        this.setState({
            bio: e.target.value
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        var self = this;
        axios.post("/bioupdate", self.state).then(resp => {
            self.props.handleBio(resp);
        });
    }

    render() {
        return (
            <div>
                <h1> profile of {this.props.name} </h1>
                {this.props.pictureurl && <img src={this.props.pictureurl} />}
                {!this.props.pictureurl && <img src="./photo1.jpeg" />}
                {this.props.bio && <p>{this.props.bio} </p>}
                {!this.props.bio && (
                    <p onClick={this.showBioUpdate}>update your bio</p>
                )}
                {this.state.bioUpdateVisable && (
                    <form onSubmit={this.handleSubmit}>
                        <input
                            onChange={this.handleChange}
                            name="bio"
                            type="text"
                            placeholder="bio"
                        />
                        <button>update</button>
                    </form>
                )}
            </div>
        );
    }
}
