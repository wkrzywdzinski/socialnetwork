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
        picture = <img onClick={props.showuploader} src="/nophoto.png" />;
    }
    return (
        <div>
            {picture}
            <p className="username">{props.name}</p>
        </div>
    );
}
