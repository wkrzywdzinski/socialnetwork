import React from "react";
import axios from "./axios";
export default class Request extends React.Component {
    constructor() {
        super();
        this.state = {
            requeststatus: null,
            buttontext: "send request"
        };
        this.handleRequest = this.handleRequest.bind(this);
    }
    componentDidMount() {
        var self = this;
        axios
            .get("/checkrequest", {
                params: {
                    receiverid: self.props.receiverid
                }
            })
            .then(function(resp) {
                if (resp.data[0]) {
                    if (resp.data[0].accepted) {
                        self.setState({
                            requeststatus: "accepted",
                            buttontext: "cancel friendship"
                        });
                    } else if (
                        resp.data[0].receiverid == self.props.receiverid
                    ) {
                        self.setState({
                            requeststatus: "sent",
                            buttontext: "cancel request"
                        });
                    } else {
                        self.setState({
                            requeststatus: "received",
                            buttontext: "accept request"
                        });
                    }
                }
            });
    }
    handleRequest(e) {
        var self = this;
        e.preventDefault();

        if (this.state.requeststatus == null) {
            axios
                .post("/request", {
                    receiverid: self.props.receiverid
                })
                .then(resp => {
                    console.log(resp);
                    if (resp.data.requestsent) {
                        this.setState({
                            requeststatus: "sent",
                            buttontext: "cancel request"
                        });
                        console.log(this.state);
                    } else {
                        console.log("requesterr");
                    }
                });
        } else if (
            this.state.requeststatus == "sent" ||
            this.state.requeststatus == "accepted"
        ) {
            axios
                .post("/cancelrequest", {
                    receiverid: self.props.receiverid
                })
                .then(resp => {
                    console.log(resp);
                    this.setState({
                        requeststatus: null,
                        buttontext: "send request"
                    });
                });
        } else if (this.state.requeststatus == "received") {
            console.log("accept");
            axios
                .post("/acceptrequest", {
                    receiverid: self.props.receiverid
                })
                .then(resp => {
                    console.log(resp);
                    this.setState({
                        requeststatus: "accepted",
                        buttontext: "cancel friendship"
                    });
                });
        }
    }
    render() {
        return (
            <form onSubmit={this.handleRequest}>
                <button>{this.state.buttontext}</button>
            </form>
        );
    }
}
