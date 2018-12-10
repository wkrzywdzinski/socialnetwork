import * as io from "socket.io-client";
let socket;
import { actionAllOnline, userJoined, userLeft } from "./actions";
export function initSocket(store) {
    if (!socket) {
        socket = io.connect();
    }
    socket.on("onlineUsers", function(results) {
        store.dispatch(actionAllOnline(results));
    });
    socket.on("userJoined", function(userID) {
        store.dispatch(userJoined(userID));
    });
    socket.on("userLeave", function(userID) {
        store.dispatch(userLeft(userID));
    });
    return socket;
}
