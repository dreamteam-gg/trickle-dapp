import { observable, observe, action } from "mobx";
import { defaultDurationOption, defaultDurationCounter } from "./constants";
import tokens from "./tokens.json";

const state = observable({

    currentAccount: "",
    currentNetwork: {
        chainId: -1,
        name: "unknown"
    },

    allTokens: [],

    inputAgreementRecipientAddress: "0x17A813dF7322F8AAC5cAc75eB62c0d13B8aea29D",
    inputAgreementTokenValue: 100,
    inputAgreementSelectedToken: {},
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

    confirmationTokensAreApproved: false,
    confirmationDisplayError: "",

    loadingPageHeader: "Loading...",
    loadingPageText: "Please, wait",
    loadingRedirectTo: "",

    relatedAgreements: [] // See pages/Index.js

});

export default state;

observe(state, "currentNetwork", action(async ({ newValue }) => {

    if (!newValue || !newValue.name) {
        console.error("Unable to switch tokens: wrong value in state.currentNetwork", newValue);
        return;
    }

    state.allTokens = (tokens[newValue.name] || []);
    state.inputAgreementSelectedToken = state.allTokens
        .find(({ address }) => address === "0x82f4ded9cec9b5750fbff5c2185aee35afc16587")
        || state.allTokens[0]
        || {};

}));

observe(state, "currentAccount", action(async ({ newValue }) => {

    // TODO: contracts loading logic
    // await contract...
    await new Promise(r => setTimeout(r, 600)); // Simulate delay
    state.relatedAgreements = [
        { startDate: new Date(), agreementId: 1, sender: state.currentAccount, recipient: state.currentAccount },
        { startDate: new Date(), agreementId: 2, sender: state.currentAccount, recipient: state.currentAccount }
    ];

}));

console.log("State", state);