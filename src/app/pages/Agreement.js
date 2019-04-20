import React, { Component } from "react";
import state from "../../state";
import { observer } from "mobx-react";
import { action } from "mobx";
import { withRouter } from "react-router-dom";
import TokenProgressBar from "../components/TokenProgressBar";
import "./AgreementPage.scss";
import { myAgreementsPagePath } from "../../constants";
import { getPathForRouter } from "../../utils";
import * as Trickle from "../../ethereum/Trickle";
import { agreementPagePath } from "../../constants";
import { startLoading, completeLoading } from "./Loading";
import { Combobox } from "react-widgets";

@observer
export default class Agreement extends Component {

    // this.props["agreementId"] is available

    async cancelAgreementButtonClick (history) {
        startLoading(
            history,
            getPathForRouter(agreementPagePath),
            "Cancelling your agreement...",
            "Your submit transaction is being mined, please wait"
        );

        await Trickle.cancelAgreement(this.props.agreementId);

        completeLoading(history);
    }

    async withdrawButtonClick (history) {
        startLoading(
            history,
            getPathForRouter(agreementPagePath, {agreementId: this.props.agreementId}),
            "Withdraw your tokens...",
            "Your submit transaction is being mined, please wait"
        );

        await Trickle.withdrawTokens(this.props.agreementId);

        completeLoading(history);
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

        const agreement = await Trickle.getAgreement(this.props.agreementId);

        state.agreementRecipientAddress = agreement.recipient;
        state.agreementDuration = agreement.duration;
        state.agreementStartDate = new Date(agreement.start * 1000);
        state.agreementSenderAddress = agreement.sender;
        state.agreementTokenAddress = agreement.token;
        state.agreementTokenValue = agreement.value;
        state.agreementReleasedTokenValue = agreement.releasedAmount;
        
        const [decimals, symbol] = await Promise.all([
            Trickle.getTokenDecimals(agreement.token),
            Trickle.getTokenSymbol(agreement.token)
        ]);

        state.agreementTokenDecimals = +decimals;
        state.agreementTokenSymbol = symbol;

    }

    render () {
        const { CancelAgreementButton, WithdrawButton, BackToAgreementsButton } = this;
        return <div className="standard-padding agreement-page">
            <div className="center buttons">
                <BackToAgreementsButton/>
            </div>
            <h1 className="center">
                <div className="agreement icon"/>
                Agreement #{ this.props["agreementId"] }
            </h1>
            <p>
                Status: ?
            </p>
            <div className="single form-input">
                <div className="label">Recipient's Ethereum Account</div>
                <div>
                    <Combobox data={[state.agreementRecipientAddress]}
                              value={ state.agreementRecipientAddress }
                              readOnly
                              selectIcon={ <div className="tiny copy icon"/> }/>
                </div>
            </div>
            <div>
                <TokenProgressBar startDate={ state.agreementStartDate }
                                  duration={ state.agreementDuration }
                                  value={ state.agreementTokenValue / state.agreementTokenDecimals }
                                  releasedValue={ state.agreementReleasedTokenValue / state.agreementTokenDecimals }
                                  decimals={ state.agreementTokenDecimals }
                                  tokenSymbol={ state.agreementTokenSymbol }/>
            </div>
            <div className="center buttons">
                <WithdrawButton/>
                <CancelAgreementButton/>
            </div>
        </div>
    }

}