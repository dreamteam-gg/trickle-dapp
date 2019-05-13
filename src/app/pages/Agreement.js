import React, { Component } from "react";
import state from "../../state";
import { observer } from "mobx-react";
import { action } from "mobx";
import { withRouter } from "react-router-dom";
import TokenProgressBar from "../components/TokenProgressBar";
import "./AgreementPage.scss";
import { myAgreementsPagePath } from "../../constants";
import { getPathForRouter, bigNumberify, getStringFromNumberWithDecimals } from "../../utils";
import * as Trickle from "../../ethereum/Trickle";
import { agreementPagePath, createAgreementPagePath } from "../../constants";
import { startLoading, completeLoading } from "./Loading";
import { Combobox } from "react-widgets";
import { Toast } from "toaster-js";
import LoadingSpinner from "../components/LoadingSpinner";

@observer
export default class Agreement extends Component {

    // this.props["agreementId"] is available

    state = {
        dummy: 0,
        loading: true
    };

    timer = 0;

    componentWillUnmount () {
        clearInterval(this.timer);
    }

    tick = () => this.setState({
        dummy: this.state.dummy + 1
    });

    async cancelAgreementButtonClick (history) {

        startLoading(
            history,
            getPathForRouter(agreementPagePath, {agreementId: this.props.agreementId}),
            "Canceling Your Agreement...",
            "Your cancel transaction is being mined, please wait..."
        );

        try {
            await Trickle.cancelAgreement(this.props.agreementId);
        } catch (e) {
            new Toast("Can't cancel already canceled agreement", Toast.TYPE_ERROR);
            console.log(e);
            completeLoading(history, getPathForRouter(agreementPagePath, { agreementId: this.props.agreementId }));
            return;
        }

        new Toast(`Agreement #${ this.props.agreementId } is canceled!`, Toast.TYPE_WARNING);

        await new Promise(r => setTimeout(r, 4000)); // +4 sec to avoid network delays
        state.relatedAgreementsUpdateCount++;

        completeLoading(history);

    }

    async withdrawButtonClick (history) {

        startLoading(
            history,
            getPathForRouter(agreementPagePath, {agreementId: this.props.agreementId}),
            "Withdrawing Your Tokens...",
            "Your withdraw transaction is being mined, please wait..."
        );

        try {
            await Trickle.withdrawTokens(this.props.agreementId);
        } catch (e) {
            console.log(e);
            new Toast("Nothing to withdraw right now", Toast.TYPE_ERROR);
            completeLoading(history, getPathForRouter(agreementPagePath, { agreementId: this.props.agreementId }));
            return;
        }

        new Toast(`Available tokens were withdrawn!`, Toast.TYPE_DONE);

        await new Promise(r => setTimeout(r, 4000)); // +4 sec to avoid network delays

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
    async updateAgreement () {

        const agreement = await Trickle.getAgreement(this.props.agreementId);
        const [decimals, symbol] = await Promise.all([
            Trickle.getTokenDecimals(agreement.token),
            Trickle.getTokenSymbol(agreement.token)
        ]);
        state.agreementRecipientAddress = agreement.recipient;
        state.agreementDuration = +agreement.duration;
        state.agreementStartDate = new Date(agreement.start * 1000);
        state.agreementSenderAddress = agreement.sender;
        state.agreementTokenAddress = agreement.token;
        state.agreementTokenValue = agreement.totalAmount.toString();
        state.agreementReleasedTokenValue = agreement.releasedAmount.toString();
        state.agreementTokenDecimals = +decimals;
        state.agreementTokenSymbol = symbol;

    }

    async componentDidMount () {

        this.setState({
            loading: true
        });
        this.timer = setInterval(this.tick, 1000);

        try {
            await this.updateAgreement();
        } catch (e) {
            new Toast("Something wrong with the agreement: " + e, Toast.TYPE_ERROR);
            console.log(e);
            completeLoading(history, createAgreementPagePath);
            return;
        }

        this.setState({
            loading: false
        });

    }

    render () {
        const { CancelAgreementButton, WithdrawButton, BackToAgreementsButton } = this;
        const now = new Date();
        const progress = Math.min(1, Math.max(0, (now.getTime() - state.agreementStartDate.getTime()) / (state.agreementDuration * 1000)));
        const status = (progress < 1 && state.agreementTokenValue === state.agreementReleasedTokenValue)
            ? "Canceled"
            : progress <= 0
                ? "Scheduled"
                : progress >= 1
                    ? "Completed"
                    : "Active";
        const isCanceled = status === "Canceled";
        const isRelated = state.currentAccount === state.agreementSenderAddress
            || state.currentAccount === state.agreementRecipientAddress;
        const withdrawableAmount = bigNumberify(state.agreementTokenValue)
            .mul(Math.floor(progress * 1000000000))
            .div(1000000000)
            .sub(state.agreementReleasedTokenValue);
        return <div className="agreement-page">
            <h1 className="standard-padding center agreement-header">
                <div className="agreement icon"/>
                Agreement #{ this.props["agreementId"] }
            </h1>
            <div className="center subtext">Status: <strong className={ `agreement-status-${ status.toLowerCase() }` }>{ status }</strong></div>
            <div className="center">{
                this.state.loading
                    ? <LoadingSpinner/>
                    : <TokenProgressBar startDate={ state.agreementStartDate }
                                        duration={ state.agreementDuration }
                                        value={ state.agreementTokenValue / Math.pow(10, state.agreementTokenDecimals) }
                                        releasedValue={ state.agreementReleasedTokenValue / Math.pow(10, state.agreementTokenDecimals) }
                                        decimals={ state.agreementTokenDecimals }
                                        tokenSymbol={ state.agreementTokenSymbol }
                                        canceled={ isCanceled }/>
            }</div>
            <div className="standard-padding">
                <div className="subtext">
                    <strong>Withdrawn:</strong> {
                        (getStringFromNumberWithDecimals(state.agreementReleasedTokenValue, state.agreementTokenDecimals))
                        || 0
                    } { state.agreementTokenSymbol }
                </div>
                <div className="subtext">
                    <strong>Withdrawable:</strong> {
                        (isCanceled
                            ? 0
                            : getStringFromNumberWithDecimals(withdrawableAmount, state.agreementTokenDecimals))
                        || 0
                    } { state.agreementTokenSymbol }
                </div>
            </div>
            <div className="single form-input">
                <div className="label"><strong>Recipient</strong>'s Ethereum Account</div>
                <div>
                    <Combobox data={[state.agreementRecipientAddress]}
                              value={ state.agreementRecipientAddress }
                              readOnly
                              selectIcon={ <div className="tiny copy icon"/> }/>
                </div>
            </div>
            <div className="single form-input">
                <div className="label">Sender's Ethereum Account</div>
                <div>
                    <Combobox data={[state.agreementSenderAddress]}
                              value={ state.agreementSenderAddress }
                              readOnly
                              selectIcon={ <div className="tiny copy icon"/> }/>
                </div>
            </div>
            <div className="center buttons">
                <BackToAgreementsButton/>
                <WithdrawButton/>
                { isRelated ? <CancelAgreementButton/> : null }
            </div>
        </div>
    }

}