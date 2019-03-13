import React from "react";
import axios from "./axios";
export default class Bio extends React.Component {
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
    handleChange(e) {
        this.setState({
            bio: e.target.value
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        var self = this;
        self.props.showBioUpdate();
        axios.post("/bio-update", self.state).then(resp => {
            self.props.handleBio(resp);
        });
    }

    render() {
        return (
            <div id="updatebiobox">
                <form onSubmit={this.handleSubmit}>
                    <input
                        onChange={this.handleChange}
                        name="bio"
                        type="text"
                        defaultValue={this.props.bio}
                    />
                    <button>update</button>
                </form>
            </div>
        );
    }
}
