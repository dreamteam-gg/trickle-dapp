import React, { Component } from "react";
import { indexPagePath } from "../../constants";
import { withRouter } from "react-router-dom";
import { getPathForRouter } from "../../utils";

import "./Info.scss";

export default class InfoPage extends Component {
    
    BackButton = withRouter(({ history }) => (
        <input type="submit"
               onClick={ () => { history.push(getPathForRouter(indexPagePath)) } }
               value="← Back to Home"/>
    ));

    render () {
        const { BackButton } = this;
        return <div className="standard-padding info-page">
            <h1 className="center">
                <div className="info icon"/>
                Information
            </h1>
            <p>
                Trickle is a complete application that allows people to create hourly-rate-driven contracts between multiple parties in any ERC20-compatible tokens or stablecoins. It implements the most transparent monetary relationships between the customer and contractors (employer/employees, teams/players and so on).
            </p>
            <ul>
                <li>From the contractor's side, the agreement is 100% safe as tokens accrued to their balance are permanent. If the employer decides to cancel the agreement, the contractor just stops providing services, without losing a thing.</li>
                <li>From the employer's side, the employer doesn't lose too much when they get a bad contractor. It's the employer's responsibility to check how well the contractor is doing. And they can cancel the agreement at any time for a reason.</li>
            </ul>
            <p>
                For example, when you are a contractor with an hourly rate of $20, you can withdraw your funds at any time: $1 after 3 minutes, or $10 after half of an hour, or $200 after 10 hours. Before the agreement is established, the employer determines the period of an agreement, and the tokens are locked on the smart contract. Later, the smart contract releases tokens to the employee according to their hourly rate.
            </p>
            <p>
                The employer has a convenient interface to manage multiple contracts with multiple contractors.
            </p>
            <p className="center">...</p>
            <p>
                This is an open-source project made on <a target="_blank" href="https://ethcapetown.com/">EthCapeTown</a>. Feel free to contribute!
            </p>
            <ul>
                <li><a target="_blank" href="https://github.com/ZitRos/trickle-dapp-frontend">Front-End Repository</a></li>
                <li><a target="_blank" href="https://github.com/DeRain/trickle-dapp-backend">Smart Contracts Repository</a></li>
            </ul>
            <div className="center buttons">
                <BackButton/>
            </div>
        </div>
    }

}