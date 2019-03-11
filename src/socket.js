import * as io from "socket.io-client";
let socket;
import {
    actionAllOnline,
    userJoined,
    userLeft,
    actionGetMessages,
    actionNewMessage
} from "./actions";
export function initSocket(store) {
    if (!socket) {
        socket = io.connect();

        socket.on("onlineUsers", function(results) {
            store.dispatch(actionAllOnline(results));
        });
        socket.on("userJoined", function(userID) {
            store.dispatch(userJoined(userID));
        });
        socket.on("userLeave", function(userID) {
            store.dispatch(userLeft(userID));
        });
        socket.on("getMessages", function(data) {
            store.dispatch(actionGetMessages(data));
        });
        socket.on("newMessage", function(data) {
            store.dispatch(actionNewMessage(data));
        });
    }
    return socket;
}
