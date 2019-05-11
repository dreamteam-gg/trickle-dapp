import React, { Component } from "react";
import { durationOptions, confirmAgreementPagePath, indexPagePath } from "../../constants";
import "./CreateAgreement.scss";
import { DateTimePicker, DropdownList, NumberPicker, Combobox } from "react-widgets";
import { observer } from "mobx-react";
import state from "../../state";
import { withRouter } from "react-router-dom";
import { getPathForRouter } from "../../utils";
import { Toast } from "toaster-js";

@observer
export default class CreateAgreement extends Component {

    BackButton = withRouter(({ history }) => (
        <input type="submit"
               onClick={ () => { history.push(getPathForRouter(indexPagePath)) } }
               value="← Back to Home"/>
    ));

    AgreementConfirmButton = withRouter(({ history }) => (
        <input type="submit"
               onClick={ () => this.onAgreementConfirmClick() && history.push(getPathForRouter(confirmAgreementPagePath)) }
               value="Confirm"/>
    ))

    onValueChange = (value) => state.inputAgreementTokenValue = value;
    onTokenSelect = (selectedToken) => state.inputAgreementSelectedToken = selectedToken;
    onDurationChange = (duration) => state.inputAgreementPeriodCounter = duration;
    onDurationSelect = (selectedDurationPeriod) => state.inputAgreementPeriodDuration = selectedDurationPeriod;
    onStartDateSet = (startDate) => state.inputAgreementStartDate = startDate;
    onRecipientAddressChange = (a) => state.inputAgreementRecipientAddress = a;

    onAgreementConfirmClick = () => {
        if (state.inputAgreementTokenValue > state.inputAgreementSelectedTokensNumber + 0.9999999999) { // +1 as inputAgreementSelectedTokensNumber might be a whole number (super rare cases)
            new Toast(
                `Warning: it looks like you don't have ${ state.inputAgreementTokenValue
                } ${ state.inputAgreementSelectedToken.symbol
                } on your balance. Refill your balance with selected token and try again.`,
                Toast.TYPE_INFO
            );
            return true;
        }
        return true;
    };

    render () {
        const { BackButton, AgreementConfirmButton } = this;
        return <div className="create-agreement-page">
            <h1 className="center">
                <div className="agreement icon"/>
                Create a New Agreement
            </h1>
            <div className="single form-input">
                <div className="label">Recipient's Ethereum Account</div>
                <div>
                    <Combobox data={[state.currentAccount]}
                              value={ state.inputAgreementRecipientAddress }
                              onChange={ this.onRecipientAddressChange }
                              placeholder="0x..."/>
                </div>
            </div>
            <div className="double form-input">
                <div className="label">
                    <div>Value Received by Recipient</div>
                    <div className={ `right state-${
                        state.inputAgreementSelectedTokensNumber >= state.inputAgreementTokenValue
                            ? "positive"
                            : "negative"
                    }` }>You have { state.inputAgreementSelectedTokensNumber } DREAM</div>
                </div>
                <div>
                    <NumberPicker value={ state.inputAgreementTokenValue }
                                  onChange={ this.onValueChange }
                                  min={ 0 }/>
                    <DropdownList filter
                                  data={ state.allTokens }
                                  onChange={ this.onTokenSelect }
                                  valueField="address"
                                  textField="symbol"
                                  value={ state.inputAgreementSelectedToken }/>
                </div>
            </div>
            <div className="double form-input">
                <div className="label">Agreement Period</div>
                <div>
                    <NumberPicker value={ state.inputAgreementPeriodCounter }
                                  onChange={ this.onDurationChange }/>
                    <DropdownList filter
                                  data={ durationOptions }
                                  onChange={ this.onDurationSelect }
                                  valueField="value"
                                  textField="label"
                                  value={ state.inputAgreementPeriodDuration }/>
                </div>
            </div>
            <div className="single form-input">
                <div className="label">Agreement Start Date</div>
                <div>
                    <DateTimePicker value={ state.inputAgreementStartDate }
                                    onChange={ this.onStartDateSet }/>
                </div>
            </div>
            <div className="center buttons">
                <BackButton/>
                <AgreementConfirmButton/>
            </div>
        </div>
    }

}