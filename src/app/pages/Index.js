import React, { Component } from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { getPathForRouter } from "../../utils";
import { createAgreementPagePath } from "../../constants";
import "./Index.scss";
import state from "../../state";

@observer
export default class Index extends Component {

    async componentDidMount () {
        // TODO: contracts loading logic
        // await contract...
        await new Promise(r => setTimeout(r, 600)); // Simulate delay
        state.relatedAgreements = [
            { startDate: new Date(), agreementId: 1, sender: state.currentAccount, recipient: state.currentAccount },
            { startDate: new Date(), agreementId: 2, sender: state.currentAccount, recipient: state.currentAccount }
        ];
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
                <h1>Trickle</h1>
                <div>
                    Your hourly pay, cryptographically secured.
                </div>
                <p>
                    [Some fun graphics here]
                </p>
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