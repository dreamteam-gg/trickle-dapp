import React, { Component } from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { getPathForRouter } from "../../utils";
import { createAgreementPagePath, demoTokens } from "../../constants";
import "./Index.scss";
import state from "../../state";
import ProgressBar from "../components/TokenProgressBar";

@observer
export default class Index extends Component {

    state = {
        tick: 0
    };
    demoInterval = 0;

    async componentDidMount () {
        // TODO: contracts loading logic
        // await contract...
        await new Promise(r => setTimeout(r, 600)); // Simulate delay
        state.relatedAgreements = [
            { startDate: new Date(), agreementId: 1, sender: state.currentAccount, recipient: state.currentAccount },
            { startDate: new Date(), agreementId: 2, sender: state.currentAccount, recipient: state.currentAccount }
        ];
        this.demoInterval = setInterval(() => this.setState({ tick: this.state.tick + 1 }), 2000);
    }

    componentWillUnmount () {
        clearInterval(this.demoInterval);
    }

    CreateAgreementButton = withRouter(({ history }) => (
        <input type="submit"
               onClick={ () => { history.push(getPathForRouter(createAgreementPagePath)) } }
               value="Create New Agreement"/>
    ));

    render () {
        const { CreateAgreementButton } = this;
        return <div className="center index page">
            <div>
                <div className="logo icon"/>
                <h1 className="hidden">Trickle</h1>
                <div className="subtitle">
                    <div>Your hourly pay, cryptographically secured.</div>
                    <div className="subtext">
                        Pay or get paid with tokens or stablecoins, today.
                    </div>
                </div>
                <ProgressBar tokenSymbol={ demoTokens[this.state.tick % demoTokens.length] }/>
                <div className="center standard-padding">
                    <CreateAgreementButton/>
                </div>
            </div>
            <div>{ state.relatedAgreements.map((agreement) =>
                <div key={ agreement.agreementId }
                     className="agreement-card">
                    <div className="head">
                        <div>Agreement #{ agreement.agreementId }</div>
                        <div>{ agreement.startDate.toLocaleString() }</div>
                    </div>
                    <div>Created By: { agreement.sender }</div>
                    <div>Recipient: { agreement.recipient }</div>
                </div>
            ) }</div>
        </div>
    }

}