import React from "react";
import axios from "./axios";

export default class Friends extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        // this.props.dispatch(getFriendsandWannabes());
    }
    render() {
        return (
            <div>
                <h1>yo friends</h1>
            </div>
        );
    }
}
///this.prop.dispatch passed cause connected//
