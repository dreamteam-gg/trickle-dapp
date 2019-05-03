import React, { Component } from "react";
import "./Footer.scss";

export default class NavBar extends Component {

    render () {
        return <div className="footer">
            <div>The decentralized service is provided "as is"</div>
            <div>
                Powered by <a target="_blank" href="https://dreamteam.gg">DreamTeam</a>
            </div>
            <div>
                <a target="_blank" href="https://github.com/dreamteam-gg?q=trickle">Source Code</a>
                |
                <a target="_blank" href="https://etherscan.io/address/trickle.ethglobal.eth#code">Smart Contract</a>
                |
                <a target="_blank" href="https://www.youtube.com/watch?v=6jz8Vux31BQ">Demo</a>
            </div>
        </div>
    }

}