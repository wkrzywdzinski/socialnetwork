export default function(state = {}, action) {
    if (action.type == "RECEIVE_ALL") {
        state = Object.assign({}, state, {
            all: action.all
        });
    }
    if (action.type == "DELETE_FRIEND") {
        console.log("reducerdelete");
        console.log(action.userid);
        state = Object.assign({}, state, {
            all: action.all
        });
    }
    if (action.type == "ADD_FRIEND") {
        console.log("reduceradd");
        console.log(action.userid);
        // state = Object.assign({}, state, {
        //     all: action.all
        // });
    }
    return state;
}
