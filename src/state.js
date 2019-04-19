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

    confirmationTokensAreApproved: false,
    confirmationDisplayError: ""

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

console.log("State", state);