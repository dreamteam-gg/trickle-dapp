import React, { Component } from "react";
import { observer } from "mobx-react";
import "./MyAgreements.scss";
import state from "../../state";
import { withRouter } from "react-router-dom";
import { indexPagePath, agreementPagePath } from "../../constants";
import { getPathForRouter } from "../../utils";

@observer
export default class MyAgreements extends Component {

    BackButton = withRouter(({ history }) => (
        <input type="submit"
               onClick={ () => { history.push(getPathForRouter(indexPagePath)) } }
               value="← Back to Home"/>
    ));

    GoToAgreementButton = (agreementId) => withRouter(({ history }) => (
        <input type="submit"
               onClick={ () => { history.push(getPathForRouter(agreementPagePath, {
                   agreementId
               })) } }
               value="View →"/>
    ));

    render () {
        const { BackButton, GoToAgreementButton } = this;
        return <div className="my-agreements-page">
            <div className="buttons standard-padding center">
                <BackButton/>
            </div>
            <h1 className="center">My Agreements</h1>
            <div>{ state.relatedAgreements.map((agreement) => {
                const ButtonComponent = GoToAgreementButton(agreement.agreementId);
                return <div key={ agreement.agreementId }
                     className="agreement-card">
                    <div className="head">
                        <div>Agreement #{ agreement.agreementId }</div>
                        <div>{ agreement.startDate.toLocaleString() }</div>
                    </div>
                    <div className="subtext"><strong>Created By</strong>: { agreement.sender }</div>
                    <div className="subtext"><strong>Recipient</strong>: { agreement.recipient }</div>
                    <div className="buttons">
                        <ButtonComponent/>
                    </div>
                </div>
            }) }</div>
        </div>
    }

}