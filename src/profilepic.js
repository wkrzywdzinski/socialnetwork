import React from "react";

export default function Profilepic(props) {
    let picture;
    if (props.pictureurl) {
        picture = (
            <div>
                <img onClick={props.showuploader} src={props.pictureurl} />
            </div>
        );
    } else {
        picture = <img onClick={props.showuploader} src="./photo1.jpeg" />;
    }
    return <div>{picture}</div>;
}
