import React, { Component } from "react";

export default class LoadingSpinner extends Component {

    render () {
        return <div className="lds-ellipsis" style={ this.props.flat ? { height: "32px" } : null }><div></div><div></div><div></div><div></div></div>;
    }

}