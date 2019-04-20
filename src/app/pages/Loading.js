import React, { Component } from "react";
import state from "../../state";
import { getPathForRouter } from "../../utils";
import { loadingPagePath } from "../../constants";

import "./Loading.scss";

export function startLoading (history, redirect, title, desc) {
    history.push(getPathForRouter(loadingPagePath));
    state.loadingRedirectTo = redirect;
    if (title) {
        state.loadingPageHeader = title;
    }
    if (desc) {
        state.loadingPageText = desc;
    }
}

export function completeLoading (history, redirect) {
    history.push(redirect || state.loadingRedirectTo);
}

export default class Agreement extends Component {

    render () {
        return <div className="standard-padding">
            <h1 className="center">
                <div className="warning icon"/>
                { state.loadingPageHeader }
            </h1>
            <div className="center">
                <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
            <p>{ state.loadingPageText }</p>
        </div>
    }

}