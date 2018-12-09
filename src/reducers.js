export default function(state = {}, action) {
    if (action.type == "RECEIVE_ALL") {
        state = Object.assign({}, state, {
            all: action.all
        });
    }
    if (action.type == "DELETE_FRIEND") {
        console.log("reducerdelete");
        state = Object.assign({}, state, {
            all: state.all.filter(function(user) {
                return user.id != action.userid;
            })
        });
    }
    if (action.type == "ADD_FRIEND") {
        console.log("reduceradd");
        state = Object.assign({}, state, {
            all: state.all.map(function(user) {
                if (user.id == action.userid) {
                    user.accepted = true;
                }
                return user;
            })
        });
    }
    return state;
}
