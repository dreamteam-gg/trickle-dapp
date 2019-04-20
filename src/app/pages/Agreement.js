import React, { Component } from "react";
import state from "../../state";
import { observer } from "mobx-react";
import { action } from "mobx";
import { withRouter } from "react-router-dom";
import { getAgreement } from "../../ethereum/Trickle";
import TokenProgressBar from "../components/TokenProgressBar";
import "./AgreementPage.scss";
import { myAgreementsPagePath } from "../../constants";
import { getPathForRouter } from "../../utils";

@observer
export default class Agreement extends Component {

    // this.props["agreementId"] is available

    async cancelAgreementButtonClick () {

    }

    async withdrawButtonClick () {

    }

    BackToAgreementsButton = withRouter(({ history }) => (
        <input type="submit"
               onClick={ () => { history.push(getPathForRouter(myAgreementsPagePath)) } }
               value="← Back to Agreements"/>
    ));

    CancelAgreementButton = withRouter(({ history }) => (
        <input type="submit"
               className="negative"
               onClick={ this.cancelAgreementButtonClick.bind(this, history) }
               value="Cancel Agreement"/>
    ));

    WithdrawButton = withRouter(({ history }) => (
        <input type="submit"
               onClick={ this.withdrawButtonClick.bind(this, history) }
               value="Withdraw"/>
    ));

    @action
    async componentDidMount () {
        const agreement = await getAgreement(this.props.agreementId);
        state.agreementRecipientAddress = agreement.recipient;
        // ...

    }

    render () {
        const { CancelAgreementButton, WithdrawButton, BackToAgreementsButton } = this;
        return <div className="standard-padding agreement-page">
            <div className="center buttons">
                <BackToAgreementsButton/>
            </div>
            <h1 className="center">Agreement #{ this.props["agreementId"] }</h1>
            <p>
                Status: ?
            </p>
            <p>
                Recipient: { state.agreementRecipientAddress }
            </p>
            <div>
                <TokenProgressBar/>
            </div>
            <div className="center buttons">
                <WithdrawButton/>
                <CancelAgreementButton/>
            </div>
        </div>
    }

}