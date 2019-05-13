import { observable, observe, action } from "mobx";
import { defaultDurationOption, defaultDurationCounter } from "./constants";
import tokens from "./tokens.json";
import * as Trickle from "./ethereum/Trickle";
import { Toast } from "toaster-js";

const state = observable({

    currentAccount: "",
    currentNetwork: {
        chainId: -1,
        name: "unknown"
    },
    currentTrickleContractAddress: "",

    allTokens: [],

    inputAgreementRecipientAddress: "",
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

    agreementRecipientAddress: "",
    agreementSenderAddress: "",
    agreementTokenValue: "100",
    agreementTokenSymbol: "USD",
    agreementReleasedTokenValue: 0,
    agreementTokenDecimals: 18,
    agreementTokenAddress: "",
    agreementDuration: defaultDurationCounter * defaultDurationOption.value,
    agreementStartDate: new Date(),

    confirmationTokensAreApproved: false,
    confirmationDisplayError: "",

    loadingPageHeader: "Loading...",
    loadingPageText: "Please, wait",
    loadingRedirectTo: "",

    relatedAgreementsLoading: true,
    relatedAgreementsUpdateCount: 0, // Inc this value to update related agreements
    relatedAgreements: [] // See pages/Index.js

});

const reloadTrickleContractAndTokens = action(async ({ newValue }) => {

    if (!newValue || !newValue.name) {
        console.error("Unable to switch tokens: wrong value in state.currentNetwork", newValue);
        return;
    }

    state.allTokens = [observable({
        "address": "0x...",
        "symbol": "CUSTOM TOKEN",
        "decimal": 18,
        "type": "default"
    })].concat(tokens[newValue.name] || []);
    state.inputAgreementSelectedToken = state.allTokens
        .find(({ symbol }) => symbol === "DREAM")
        || state.allTokens[0]
        || {};

    try {
        state.currentTrickleContractAddress = await Trickle.getTrickleAddress();
    } catch (e) {
        new Toast(e, Toast.TYPE_ERROR);
        return;
    }

    await Promise.all([
        reloadCurrentAgreements(),
        reloadCurrentTokensTrigger()
    ]);

});

const reloadCurrentTokensTrigger = action(async () => {

    if (state.inputAgreementSelectedTokensNumber !== "...") {
        state.inputAgreementSelectedTokensNumber = "...";
    }

    if (!state.inputAgreementSelectedToken || !state.inputAgreementSelectedToken.address) {
        return;
    }

    const value = await Trickle.getTokenBalanceOf(state.inputAgreementSelectedToken.address, state.currentAccount);

    state.inputAgreementSelectedTokensNumber = +value.toString(10).slice(0, -state.inputAgreementSelectedToken.decimal);

});

const reloadCurrentAgreements = action(async ({ newValue = state.currentAccount } = {}) => {

    state.relatedAgreementsLoading = true;

    const mapAgreement = (item) => ({
        startDate: new Date(item.start * 1000),
        duration: item.duration.toString(),
        agreementId: item.agreementId.toString(),
        sender: item.sender,
        recipient: item.recipient,
        amountReleased: item.amountReleased
            ? item.amountReleased.toString()
            : undefined,
        amountCanceled: item.amountCanceled
            ? item.amountCanceled.toString()
            : undefined,
        canceledAt: item.canceledAt
            ? new Date(1000 * item.canceledAt.toString())
            : undefined
    });

    const now = Date.now();
    let [created, received, canceledCreated, canceledReceived] = await Promise.all([
        Trickle.getCreatedAgreements(newValue),
        Trickle.getCreatedAgreements(null, newValue),
        Trickle.getCanceledAgreements(newValue),
        Trickle.getCanceledAgreements(null, newValue)
    ]);
    [created, received, canceledCreated, canceledReceived] = [
        created, received, canceledCreated, canceledReceived
    ].map(arr => arr.map(mapAgreement));
    const canceledById = new Map(canceledCreated.concat(canceledReceived).map(a => [a.agreementId, a]));
    const allAgreements = created.concat(
        // Filter existing agreements to avoid duplicates (as created and received can get the same ID)
        received.filter(({ agreementId }) => !created.find(a => agreementId === a.agreementId))
    ).map(agreement => 
        canceledById.has(agreement.agreementId)
            ? Object.assign(agreement, canceledById.get(agreement.agreementId))
            : agreement
    ).sort((a, b) => {
        if (a.startDate.getTime() + a.duration * 1000 > now) { // Sort active agreements to the top
            return -1;
        }
        return +a.agreementId - b.agreementId;
    });

    state.relatedAgreements = allAgreements;
    state.relatedAgreementsLoading = false;

});

observe(state, "inputAgreementSelectedToken", reloadCurrentTokensTrigger);
observe(state, "currentAccount", reloadCurrentTokensTrigger);
observe(state, "currentNetwork", reloadTrickleContractAndTokens);
observe(state, "currentAccount", reloadCurrentAgreements);
observe(state, "relatedAgreementsUpdateCount", reloadCurrentAgreements);

console.log("State Object", state);

export default state;