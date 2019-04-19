import { observable, observe, action } from "mobx";
import tokens from "./tokens.json";

const state = observable({

    currentAccount: "",
    currentNetwork: {
        chainId: -1,
        name: "unknown"
    },

    allTokens: [],
    defaultToken: {}

});

export default state;

observe(state, "currentNetwork", action(async ({ newValue }) => {

    if (!newValue || !newValue.name) {
        console.error("Unable to switch tokens: wrong value in state.currentNetwork", newValue);
        return;
    }

    state.allTokens = (tokens[newValue.name] || []);
    state.defaultToken = state.allTokens
        .find(({ address }) => address === "0x82f4ded9cec9b5750fbff5c2185aee35afc16587")
        || state.allTokens[0]
        || {};

}));

console.log("State", state);