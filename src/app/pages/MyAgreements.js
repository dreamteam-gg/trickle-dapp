import React, { Component } from "react";
import { observer } from "mobx-react";
import "./MyAgreements.scss";
import state from "../../state";
import { withRouter } from "react-router-dom";
import { indexPagePath, agreementPagePath } from "../../constants";
import { getPathForRouter, shortenEthereumAddress } from "../../utils";

@observer
export default class MyAgreements extends Component {

    BackButton = withRouter(({ history }) => (
        <input type="submit"
               onClick={ () => { history.push(getPathForRouter(indexPagePath)) } }
               value="← Back to Home"/>
    ));

    GoToAgreementButton = (agreementId, isManaged) => withRouter(({ history }) => (
        <input type="submit"
               onClick={ () => { history.push(getPathForRouter(agreementPagePath, {
                   agreementId
               })) } }
               value={ isManaged ? "Manage →" : "View →" }/>
    ));

    render () {
        const { BackButton, GoToAgreementButton } = this;
        return <div className="my-agreements-page">
            <div className="buttons standard-padding center">
                <BackButton/>
            </div>
            <h1 className="center">
                <div className="agreement icon"/>
                My Agreements
            </h1>
            <div>{ state.relatedAgreements.map((agreement) => {

                const isManaged = agreement.sender === state.currentAccount;
                const ButtonComponent = GoToAgreementButton(agreement.agreementId, isManaged);
                const endDate = new Date(agreement.startDate.getTime() + agreement.duration * 1000);

                return <div key={ agreement.agreementId }
                            className="agreement-card">
                    <div className="head">
                        <div>
                            <div>Agreement #{ agreement.agreementId }</div>
                        </div>
                        <div className="subtext dates">
                            <div>From { agreement.startDate.toLocaleString() }</div>
                            <div>To { endDate.toLocaleString() }</div>
                        </div>
                    </div>
                    <div className="addresses">
                        <div className="subtext"><strong>Created By</strong>: { shortenEthereumAddress(agreement.sender) }</div>
                        <div className="subtext"><strong>Recipient</strong>: { shortenEthereumAddress(agreement.recipient) }</div>
                    </div>
                    <div className="buttons center">
                        <ButtonComponent/>
                    </div>
                </div>

            }) }</div>
        </div>
    }

}