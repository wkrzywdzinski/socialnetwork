import React from "react";
import { connect } from "react-redux";
import { receiveFriendsAndWannabes, actionAdd, actionDelete } from "./actions";
// import axios from "./axios";

class Friends extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.deleteFriend = this.deleteFriend.bind(this);
        this.addFriend = this.addFriend.bind(this);
    }
    deleteFriend(userid) {
        console.log("delete");
        this.props.dispatch(actionDelete(userid));
    }
    addFriend(userid) {
        console.log("add");
        this.props.dispatch(actionAdd(userid));
    }
    componentDidMount() {
        this.props.dispatch(receiveFriendsAndWannabes());
    }
    render() {
        const wannabes = this.props.wannabes;
        const friends = this.props.friends;
        if (!wannabes) {
            return null;
        }
        if (!friends) {
            return null;
        }
        const wannabesrender = (
            <div className="users">
                {wannabes.map(user => (
                    <div key={user.id} className="user">
                        <img src={user.pictureurl} />
                        <h1>{user.name}</h1>
                        <button onClick={() => this.addFriend(user.id)}>
                            add
                        </button>
                    </div>
                ))}
            </div>
        );
        const friendsrender = (
            <div className="users">
                {friends.map(user => (
                    <div key={user.id} className="user">
                        <img src={user.pictureurl} />
                        <h1>{user.name}</h1>
                        <button onClick={() => this.deleteFriend(user.id)}>
                            cancel friendship
                        </button>
                    </div>
                ))}
            </div>
        );

        return (
            <div id="friendsandwannabes">
                <div className="friendsbox">
                    <h1>wannabes</h1>
                    {wannabesrender}
                </div>
                <div>
                    <h1>friends</h1>
                    {friendsrender}
                </div>
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        friends: state.all && state.all.filter(user => user.accepted == true),
        wannabes: state.all && state.all.filter(user => user.accepted == false)
    };
};

export default connect(mapStateToProps)(Friends);
