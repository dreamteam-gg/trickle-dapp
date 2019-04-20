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

export function completeLoading (history) {
    history.push(state.loadingRedirectTo);
}

export default class Agreement extends Component {

    render () {
        return <div className="standard-padding">
            <h1>{ state.loadingPageHeader }</h1>
            <p>{ state.loadingPageText }</p>
        </div>
    }

}