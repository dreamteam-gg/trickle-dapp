import { observable, observe, action } from "mobx";
import { defaultDurationOption, defaultDurationCounter } from "./constants";
import tokens from "./tokens.json";
import * as Trickle from "./ethereum/Trickle";

const state = observable({

    currentAccount: "",
    currentNetwork: {
        chainId: -1,
        name: "unknown"
    },
    currentTrickleContractAddress: "",

    allTokens: [],

    inputAgreementRecipientAddress: "0x17A813dF7322F8AAC5cAc75eB62c0d13B8aea29D",
    inputAgreementTokenValue: 100,
    inputAgreementSelectedToken: {
        "address": "",
        "symbol": "",
        "decimal": 0,
        "type": ""
    },
    inputAgreementSelectedTokensNumber: "?",
    inputAgreementPeriodDuration: defaultDurationOption, // Seconds
    inputAgreementPeriodCounter: defaultDurationCounter,
    inputAgreementStartDate: new Date(),

    agreementRecipientAddress: "0x17A813dF7322F8AAC5cAc75eB62c0d13B8aea29D",
    agreementSenderAddress: "0x17A813dF7322F8AAC5cAc75eB62c0d13B8aea29D",
    agreementTokenValue: 100,
    agreementTokenSymbol: "USD",
    agreementReleasedTokenValue: 0,
    agreementTokenDecimals: 18,
    agreementTokenAddress: "",
    agreementDuration: defaultDurationCounter * defaultDurationOption,
    agreementStartDate: new Date(),
    agreementCancelled: false,

    confirmationTokensAreApproved: false,
    confirmationDisplayError: "",

    loadingPageHeader: "Loading...",
    loadingPageText: "Please, wait",
    loadingRedirectTo: "",

    relatedAgreementsLoading: true,
    relatedAgreements: [] // See pages/Index.js

});

export default state;

const reloadCurrentTokensTrigger = action(async () => {

    if (!state.inputAgreementSelectedToken || !state.inputAgreementSelectedToken.address) {
        return;
    }

    const value = await Trickle.getTokenBalanceOf(state.inputAgreementSelectedToken.address, state.currentAccount);

    state.inputAgreementSelectedTokensNumber = +value.toString(10).slice(0, -state.inputAgreementSelectedToken.decimal);

});

observe(state, "inputAgreementSelectedToken", reloadCurrentTokensTrigger);
observe(state, "currentAccount", reloadCurrentTokensTrigger);
observe(state, "currentNetwork", reloadCurrentTokensTrigger);

observe(state, "currentNetwork", action(async ({ newValue }) => { // Currently, this changes only at startup

    // Dynamic change blocked by library https://github.com/ethers-io/ethers.js/issues/495

    if (!newValue || !newValue.name) {
        console.error("Unable to switch tokens: wrong value in state.currentNetwork", newValue);
        return;
    }

    state.allTokens = (tokens[newValue.name] || []);
    state.inputAgreementSelectedToken = state.allTokens
        .find(({ address }) => address === "0x82f4ded9cec9b5750fbff5c2185aee35afc16587")
        || state.allTokens[0]
        || {};

    state.currentTrickleContractAddress = await Trickle.getTrickleAddress();

}));

observe(state, "currentAccount", action(async ({ newValue }) => {

    state.relatedAgreementsLoading = true;

    function mapAgreement (item) {
        return {
            startDate: new Date(item.start * 1000),
            duration: item.duration.toString(),
            agreementId: item.agreementId.toString(),
            sender: item.sender,
            recipient: item.recipient
        }
    }

    let [created, received] = await Promise.all([
        Trickle.getCreatedAgreements(newValue),
        Trickle.getCreatedAgreements(null, newValue)
    ]);
    [created, received] = [created.map(mapAgreement), received.map(mapAgreement)];
    const allAgreements = created.concat(
        received.filter(({ agreementId }) => !created.find(a => agreementId === a.agreementId))
    ).sort((a, b) => +a.agreementId - b.agreementId);

    // Filter existing agreements to avoid duplicates (as created and received can get the same ID)
    state.relatedAgreements = allAgreements;
    state.relatedAgreementsLoading = false;

}));

console.log("State Object", state);