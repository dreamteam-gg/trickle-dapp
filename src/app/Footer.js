import React, { Component } from "react";
import "./Footer.scss";
import { observer } from "mobx-react";
import state from "../state";
import { version } from "../../package.json";

@observer
export default class NavBar extends Component {

    render () {
        const isMainnet = state.currentNetwork && state.currentNetwork.chainId == 1;
        return <div className="footer">
            <div>The decentralized service is provided "as is" (@{
                isMainnet
                    ? <span className="state-positive">mainnet</span>
                    : <span className="state-negative">testnet</span>
            })</div>
            <div>
                Powered by <a target="_blank" href="https://dreamteam.gg">DreamTeam</a>
            </div>
            <div>
                <a target="_blank" href="https://github.com/dreamteam-gg/trickle-dapp/commits/master">v{ version }</a> |&nbsp;
                <a target="_blank" href="https://github.com/dreamteam-gg/trickle-dapp">Source Code</a>
                &nbsp;|&nbsp;
                <a target="_blank" href="https://etherscan.io/address/trickle.ethglobal.eth#code">Smart Contract</a>
                &nbsp;|&nbsp;
                <a target="_blank" href="https://www.youtube.com/watch?v=6jz8Vux31BQ">Demo</a>
                &nbsp;|&nbsp;
                <a target="_blank" href="https://github.com/dreamteam-gg/trickle-dapp/blob/master/LICENSE">LICENSE</a>
            </div>
        </div>
    }

}