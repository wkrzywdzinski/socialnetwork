import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

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
                <h1>users online:</h1>
                {online.map(user => (
                    <div key={user.id} className="user">
                        <Link to={`/user/${user.id}`}>
                            <p>
                                {user.name} {user.lastname}
                            </p>
                            <img src={user.pictureurl} />
                        </Link>
                    </div>
                ))}
            </div>
        );

        return <div>{onlinerender}</div>;
    }
}

const mapStateToProps = function(state) {
    return {
        online: state.online
    };
};

export default connect(mapStateToProps)(Online);
