import React from "react";

export default function Profilepic(props) {
    let picture;
    if (props.pictureurl) {
        picture = (
            <div id="picturebox">
                <img onClick={props.showuploader} src={props.pictureurl} />
                <div id="changepicture" />
            </div>
        );
    } else {
        picture = <img onClick={props.showuploader} src="./photo1.jpeg" />;
    }
    return (
        <div>
            <h1>hello {props.name} !</h1>
            {picture}
        </div>
    );
}
