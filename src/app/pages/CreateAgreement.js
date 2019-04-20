import React, { Component } from "react";
import { durationOptions, confirmAgreementPagePath, indexPagePath } from "../../constants";
import "./CreateAgreement.scss";
import { DateTimePicker, DropdownList, NumberPicker, Combobox } from "react-widgets";
import { observer } from "mobx-react";
import state from "../../state";
import { withRouter } from "react-router-dom";
import { getPathForRouter } from "../../utils";

const AgreementConfirmButton = withRouter(({ history }) => (
  <input type="submit"
         onClick={ () => { history.push(getPathForRouter(confirmAgreementPagePath)) } }
         value="Confirm"/>
));

@observer
export default class CreateAgreement extends Component {

    BackButton = withRouter(({ history }) => (
        <input type="submit"
               onClick={ () => { history.push(getPathForRouter(indexPagePath)) } }
               value="← Back"/>
    ));

    onValueChange = (value) => state.inputAgreementTokenValue = value;
    onTokenSelect = (selectedToken) => state.inputAgreementSelectedToken = selectedToken;
    onDurationChange = (duration) => state.inputAgreementPeriodCounter = duration;
    onDurationSelect = (selectedDurationPeriod) => state.inputAgreementPeriodDuration = selectedDurationPeriod;
    onStartDateSet = (startDate) => state.inputAgreementStartDate = startDate;
    onRecipientAddressChange = (a) => state.inputAgreementRecipientAddress = a;

    render () {
        const { BackButton } = this;
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
                              onChange={ this.onRecipientAddressChange }/>
                </div>
            </div>
            <div className="double form-input">
                <div className="label">Value Received by Recipient</div>
                <div>
                    <NumberPicker value={ state.inputAgreementTokenValue }
                                onChange={ this.onValueChange }/>
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
            <div className="center standard-padding buttons">
                <BackButton/>
                <AgreementConfirmButton/>
            </div>
        </div>
    }

}