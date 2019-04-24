import React, { Component } from "react";
import "./Footer.scss";

export default class NavBar extends Component {

    render () {
        return <div className="footer">
            <div>Decentralized monetary smart agreements service is provided "as is"</div>
            <div>Powered by <a target="_blank" href="https://dreamteam.gg">DreamTeam</a></div>
        </div>
    }

}