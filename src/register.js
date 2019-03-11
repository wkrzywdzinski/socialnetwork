import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = { error: false };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        axios.post("/registration", this.state).then(resp => {
            if (resp.data.success) {
                location.replace("/");
                this.setState({
                    error: false
                });
            } else {
                this.setState({
                    error: true
                });
            }
        });
    }
    render() {
        return (
            <div className="registerbox">
                <h1>please register</h1>
                {this.state.error && <p className="error">error</p>}
                <form onSubmit={this.handleSubmit}>
                    <input
                        onChange={this.handleChange}
                        name="firstname"
                        type="text"
                        placeholder="firstname"
                    />
                    <input
                        onChange={this.handleChange}
                        name="lastname"
                        type="text"
                        placeholder="lastname"
                    />
                    <input
                        onChange={this.handleChange}
                        name="email"
                        type="text"
                        placeholder="email"
                    />
                    <input
                        onChange={this.handleChange}
                        name="password"
                        type="password"
                        placeholder="password"
                    />
                    <button>submit</button>
                </form>
                <Link to="/login" style={{ color: "#000000" }}>
                    or click here to login
                </Link>
            </div>
        );
    }
}
