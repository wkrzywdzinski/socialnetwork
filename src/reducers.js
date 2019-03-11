export default function(state = {}, action) {
    if (action.type == "ALL_ONLINE") {
        state = Object.assign({}, state, {
            online: action.online
        });
    }

    if (action.type == "USER_JOINED") {
        state = Object.assign({}, state, {
            online: state.online.concat(action.newuser)
        });
    }

    if (action.type == "USER_LEFT") {
        state = Object.assign({}, state, {
            online:
                state.online &&
                state.online.filter(user => user.id != action.id)
        });
    }

    if (action.type == "RECEIVE_ALL") {
        state = Object.assign({}, state, {
            all: action.all
        });
    }

    if (action.type == "ADD_FRIEND") {
        state = Object.assign({}, state, {
            all: state.all.map(function(user) {
                if (user.id == action.userid) {
                    user.accepted = true;
                }
                return user;
            })
        });
    }

    if (action.type == "DELETE_FRIEND") {
        state = Object.assign({}, state, {
            all: state.all.filter(function(user) {
                return user.id != action.userid;
            })
        });
    }

    if (action.type == "GET_MESSAGES") {
        state = Object.assign({}, state, {
            messages: action.messages
        });
    }
    if (action.type == "NEW_MESSAGE") {
        state = Object.assign({}, state, {
            messages: state.messages.concat(action.newmessage)
        });
    }

    return state;
}
