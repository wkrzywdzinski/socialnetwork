import axios from "./axios";

export async function receiveFriendsAndWannabes() {
    const { data } = await axios.get("/receiveall");
    return {
        type: "RECEIVE_ALL",
        all: data
    };
}
export async function actionAdd(userid) {
    const { data } = axios.post("/acceptrequest", {
        receiverid: userid
    });
    return {
        type: "ADD_FRIEND",
        userid: userid,
        all: data
    };
}
export async function actionDelete(userid) {
    const { data } = await axios.post("/cancelrequest", {
        receiverid: userid
    });
    return {
        type: "DELETE_FRIEND",
        userid: userid,
        all: data
    };
}
