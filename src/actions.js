import axios from "./axios";
export async function actionGetMessages(results) {
    return {
        messages: results,
        type: "GET_MESSAGES"
    };
}

export async function actionNewMessage(results) {
    return {
        newmessage: results,
        type: "NEW_MESSAGE"
    };
}

export async function actionAllOnline(results) {
    return {
        online: results,
        type: "ALL_ONLINE"
    };
}
export async function userJoined(results) {
    return {
        newuser: results,
        type: "USER_JOINED"
    };
}
export async function userLeft(userID) {
    return {
        type: "USER_LEFT",
        id: userID
    };
}
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
