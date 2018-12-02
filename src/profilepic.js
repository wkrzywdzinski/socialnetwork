import React from "react";

export default function Profilepic(props) {
    let picture;
    if (props.pictureurl) {
        picture = <img onClick={props.showuploader} src={props.pictureurl} />;
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
