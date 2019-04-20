import React, { Component } from "react";
import state from "../../state";
import { observer } from "mobx-react";
import { action } from "mobx";
import { withRouter } from "react-router-dom";
import "./AgreementPage.scss";

@observer
export default class Agreement extends Component {

    // this.props["agreementId"] is available

    async cancelAgreementButtonClick () {

    }

    async withdrawButtonClick () {

    }

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
        await new Promise(r => setTimeout(r, 500)); // TODO: replace simulated delay with getting contract details
        state.agreementRecipientAddress = "0xLOADED";
        // ...

    }

    render () {
        const { CancelAgreementButton, WithdrawButton } = this;
        return <div className="standard-padding agreement-page">
            <h1 className="center">Agreement #{ this.props["agreementId"] }</h1>
            <p>
                Status: ?
            </p>
            <p>
                Recipient: { state.agreementRecipientAddress }
            </p>
            <div className="center buttons">
                <WithdrawButton/>
                <CancelAgreementButton/>
            </div>
        </div>
    }

}