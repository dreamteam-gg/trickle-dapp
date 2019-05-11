import React, { Component } from "react";
import { observer } from "mobx-react";
import "./MyAgreements.scss";
import state from "../../state";
import { withRouter } from "react-router-dom";
import { indexPagePath, agreementPagePath } from "../../constants";
import { getPathForRouter, shortenEthereumAddress } from "../../utils";
import LoadingSpinner from "../components/LoadingSpinner";

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
            { state.relatedAgreementsLoading
                ? <div className="center"><LoadingSpinner/></div>
                : null }
            <div>{ state.relatedAgreements.map((agreement) => {

                const now = new Date();
                const isManaged = agreement.sender === state.currentAccount;
                const endDate = new Date(agreement.startDate.getTime() + agreement.duration * 1000);
                const progress = Math.min(1, Math.max(0, (now.getTime() - agreement.startDate.getTime()) / (agreement.duration * 1000)));
                const status = progress <= 0
                    ? "Scheduled"
                    : progress >= 1
                        ? "Completed"
                        : agreement.canceledAt
                            ? "Canceled"
                            : "Active";
                const ButtonComponent = GoToAgreementButton(agreement.agreementId, agreement.canceledAt ? 0 : isManaged);

                return <div key={ agreement.agreementId }
                            className="agreement-card">
                    <div className="head">
                        <div>
                            <div>
                                <div className={ `arrow-${ isManaged ? "up" : "down" } tiny icon` }/>
                                Agreement #{ agreement.agreementId }
                            </div>
                        </div>
                        <div className="subtext dates">
                            <div>From { agreement.startDate.toLocaleString() }</div>
                            <div>To { endDate.toLocaleString() }</div>
                        </div>
                    </div>
                    <div className="body">
                        <div className="addresses">
                            <div className="subtext"><strong>Status</strong>: <strong className={ `agreement-status-${ status.toLowerCase() }` }>{ status }</strong></div>
                            <div className="subtext"><strong>Created By</strong>: { shortenEthereumAddress(agreement.sender) }</div>
                            <div className="subtext"><strong>Recipient</strong>: { shortenEthereumAddress(agreement.recipient) }</div>
                        </div>
                        <div className="buttons center">
                            <ButtonComponent/>
                        </div>
                    </div>
                </div>

            }) }</div>
        </div>
    }

}