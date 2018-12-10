import React from "react";
import { connect } from "react-redux";
// import { receiveFriendsAndWannabes, actionAdd, actionDelete } from "./actions";
// import axios from "./axios";

class Online extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    render() {
        const online = this.props.online;
        if (!online) {
            return null;
        }
        const onlinerender = (
            <div className="users">
                {online.map(user => (
                    <div key={user.id} className="user">
                        <h1>{user.name}</h1>
                        <img src={user.pictureurl} />
                    </div>
                ))}
            </div>
        );

        return (
            <div>
                <h1>online</h1>
                {onlinerender}
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        online: state.online
    };
};

export default connect(mapStateToProps)(Online);
