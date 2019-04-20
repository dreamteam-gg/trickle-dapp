import React, { Component } from "react";
import state from "../../state";
import "./ConfirmAgreement.scss";
import { observer } from "mobx-react";
import { createAgreementPagePath, confirmAgreementPagePath, agreementPagePath } from "../../constants";
import { withRouter } from "react-router-dom";
import { getPathForRouter, getEtherscanLinkToAddress } from "../../utils";
import { startLoading, completeLoading } from "./Loading";
import * as Trickle from "../../ethereum/Trickle";
import { Toast } from "toaster-js";

@observer
export default class ConfirmAgreement extends Component {

    ApproveTokensDemoButton = withRouter(({ history }) => (
        <input type="submit"
               onClick={ this.approveTokens.bind(this, history) }
               value="Approve Tokens"/>
    ));

    CreateAgreementButton = withRouter(({ history }) => (
        <input type="submit"
               className="warning"
               onClick={ this.createAgreement.bind(this, history) }
               value="Create Agreement"/>
    ));

    BackToEditingButton = withRouter(({ history }) => (
        <input type="submit"
               onClick={ () => { history.push(getPathForRouter(createAgreementPagePath)) } }
               value="← Back to Editing"/>
    ));

    async componentDidMount () {
        try {
            await this.updateTokensApprovalState();
        } catch (e) {
            console.log(e);
            new Toast("Can't get token allowance status", Toast.TYPE_ERROR);
            completeLoading(history, getPathForRouter(confirmAgreementPagePath));
            return;
        }
    }

    async updateTokensApprovalState () {
        state.confirmationTokensAreApproved = await Trickle.isTokenAllowed();
    }

    approveTokens = async (history) => {

        startLoading(
            history,
            getPathForRouter(confirmAgreementPagePath),
            "Waiting for Approval...",
            "Your token approval transaction is pending, please wait until we get a confirmation."
        );

        try {
            await Trickle.allowTokens();
        } catch (e) {
            console.log(e);
            new Toast("Transaction failed: you've cancelled the transaction", Toast.TYPE_ERROR);
            completeLoading(history, getPathForRouter(confirmAgreementPagePath));
            return;
        }

        completeLoading(history);

    }

    createAgreement = async (history) => {

        startLoading(
            history,
            getPathForRouter(agreementPagePath),
            "Creating an Agreement...",
            `Your agreement creation transaction of ${ state.inputAgreementTokenValue } ${ state.inputAgreementSelectedToken.symbol } is being mined, please wait...`
        );

        let agreementId;
        try {
            agreementId = await Trickle.createAgreement();
        } catch (e) {
            console.log(e);
            new Toast("Transaction failed: you've cancelled the transaction or you have no required tokens", Toast.TYPE_ERROR);
            completeLoading(history, getPathForRouter(confirmAgreementPagePath));
            return;
        }

        startLoading( // Just to give the new agreementId
            history,
            getPathForRouter(agreementPagePath, {agreementId}),
        );
        completeLoading(history);

    }

    render () {
        const {
            CreateAgreementButton, ApproveTokensDemoButton, BackToEditingButton
        } = this;
        return <div className="standard-padding confirm-agreement-page">
            <h1 className="center">
                <div className="protection icon"/>
                Confirm Agreement
            </h1>
            <p>
                You are about to sign a smart contract with your recipient.
            </p>
            <ol className="subtext">
                <li>
                    <span className="bold">Smart Contract Address</span>: <a target="_blank" href={ getEtherscanLinkToAddress(state.inputAgreementSelectedToken.address, state.currentNetwork.name) }>{ state.inputAgreementSelectedToken.address }</a>
                </li>
                <li>
                    <span className="bold">Recipient Ethereum Account</span>: <a target="_blank" href={ getEtherscanLinkToAddress(state.inputAgreementRecipientAddress, state.currentNetwork.name) }>{ state.inputAgreementRecipientAddress }</a>
                </li>
                <li>
                    <span className="bold">Locked Value for Recipient</span>: { state.inputAgreementTokenValue } { state.inputAgreementSelectedToken.symbol }
                </li>
                <li>
                    <span className="bold">Token Contract</span>: <a target="_blank" href={ getEtherscanLinkToAddress(state.inputAgreementSelectedToken.address, state.currentNetwork.name) }>{ state.inputAgreementSelectedToken.address }</a>
                </li>
                <li>
                    <span className="bold">Agreement Period Starts At</span>: { new Date(state.inputAgreementStartDate).toLocaleString() }
                </li>
                <li>
                    <span className="bold">Agreement Period Ends At</span>: { new Date(state.inputAgreementStartDate.getTime() + state.inputAgreementPeriodDuration.value * state.inputAgreementPeriodCounter * 1000).toLocaleString() } ({ state.inputAgreementPeriodCounter } { state.inputAgreementPeriodDuration.label })
                </li>
                <li>
                    <span className="bold">Token Distribution Rule</span>: Linear over entire period. Recipient can withdraw available tokens at any time.
                </li>
                <li>
                    <span className="bold">Agreement Termination Policy</span>: Recipient receives all tokens that accrued prior to the termination date. 
                </li>
                <li>
                    <span className="bold">Agreement Can Be Terminated By</span>: Customer only.
                </li>
            </ol>
            <div>
                { state.confirmationDisplayError }
            </div>
            <div className="buttons-section">
                <BackToEditingButton/>
                { state.confirmationTokensAreApproved
                    ? <CreateAgreementButton/>
                    : <ApproveTokensDemoButton/>
                }
            </div>
            <p>
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
            </p>
        </div>
    }

}