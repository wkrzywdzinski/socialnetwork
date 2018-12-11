import React from "react";
import { connect } from "react-redux";
import { initSocket } from "./socket";

class Chat extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.sendMessage = this.sendMessage.bind(this);
    }
    // componentDidUpdate() {
    //     console.log("change", this.elem);
    //     this.elem.scrollTop = this.elem.scrollHeight;
    // }
    sendMessage(e) {
        let socket = initSocket();
        if (e.which == 13) {
            e.preventDefault();
            console.log(e.target.value);
            socket.emit("chatmessage", e.target.value);
            e.target.value = "";
        }
    }

    render() {
        const messages = this.props.messages;
        if (!messages) {
            return null;
        }
        const messagerender = (
            <div className="users">
                {messages.map(message => (
                    <div key={message.id} className="user">
                        <p>
                            {message.name}: {message.message}{" "}
                        </p>
                    </div>
                ))}
            </div>
        );

        return (
            <div>
                <h1>chat</h1>
                {messagerender}
                <textarea onKeyDown={this.sendMessage} />
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        messages: state.messages
    };
};

export default connect(mapStateToProps)(Chat);
