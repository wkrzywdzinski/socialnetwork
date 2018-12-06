import axios from "axios";

export async function receiveFriendsAndWannabes() {
    const { data } = await axios.get("/receiveall");
    return {
        type: "RECEIVE_ALL",
        all: data
    };
}
export async function actionAdd(userid) {
    const { data } = await axios.get("/receiveall");
    return {
        type: "ADD_FRIEND",
        userid: userid,
        all: data
    };
}
export async function actionDelete(userid) {
    const { data } = await axios.get("/receiveall");
    return {
        type: "DELETE_FRIEND",
        userid: userid,
        all: data
    };
}
