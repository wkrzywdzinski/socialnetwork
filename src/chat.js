import React from "react";
import { connect } from "react-redux";
import { initSocket } from "./socket";

class Chat extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.sendMessage = this.sendMessage.bind(this);
    }
    componentDidUpdate() {
        this.elem.scrollTop = this.elem.scrollHeight;
    }
    sendMessage(e) {
        let socket = initSocket();
        if (e.which == 13) {
            e.preventDefault();
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
            <div>
                {messages.map(message => (
                    <div key={message.id} className="message">
                        <p>
                            {message.name}: {message.message}
                        </p>
                    </div>
                ))}
            </div>
        );

        return (
            <div id="chatbox" ref={elem => (this.elem = elem)}>
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
