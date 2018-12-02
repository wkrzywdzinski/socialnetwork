import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            file: e.target.files[0]
        });
    }
    handleSubmit(e) {
        var self = this;
        e.preventDefault();
        var formData = new FormData();
        formData.append("file", this.state.file);
        axios.post("/upload", formData).then(function(resp) {
            self.props.handlePicture(resp);
        });
    }

    render() {
        return (
            <div>
                <h1>upload an image</h1>
                <form onSubmit={this.handleSubmit}>
                    <input
                        onChange={this.handleChange}
                        type="file"
                        accept="image/*"
                    />
                    <button>upload</button>
                </form>
            </div>
        );
    }
}
