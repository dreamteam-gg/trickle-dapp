import { Contract, utils } from "ethers";
import contractAbi from "./Trickle-ABI.json";
import tokenContractAbi from "./Token-ABI.json";
import getProvider from "./provider";
import { contractsByNetwork, confirmationsToWait } from "../constants";
import state from "../state";
import { toUtf8String } from "ethers/utils/utf8";
import cloneDeep from "clone-deep";

export async function getTokenDecimals (address) {

    return await (await getTokenContract(address)).decimals();

}

export async function getTokenSymbol (address) {

    try {
        return await (await getTokenContract(address)).symbol();
    } catch (e) {
        // Crutch for DAI Token: https://etherscan.io/token/0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359
        // They've defined symbol as "bytes32" but not "string"...
        const abi = cloneDeep(tokenContractAbi).map((item) => {
            if (item.name === "symbol") {
                item.outputs[0].type = "bytes32";
            }
            return item;
        });
        const symbol = await (await getTokenContract(address, abi)).symbol();
        return toUtf8String(symbol.replace(/0+$/, ""), true);
    }

}

export async function getTokenBalanceOf (address, owner) {

    return await (await getTokenContract(address)).balanceOf(owner);

}

export async function getAgreement (agreementId) {

    const contract = await getTrickleContract();
    const data = await contract.getAgreement(agreementId);

    return {
        agreementId,
        ...data
    };

}

export async function allowTokens () {
    const contract = await getTokenContract();
    const trickleAddress = await getTrickleAddress();
    const totalSupply = await contract.totalSupply();
    const tx = await contract.approve(trickleAddress, totalSupply);
    await tx.wait(confirmationsToWait);

}

export async function isTokenAllowed () {

    const contract = await getTokenContract();
    const owner = state.currentAccount;
    const spender = await getTrickleAddress();
    const allowance = await contract.allowance(owner, spender);
    const tokenValue = calculateWithDecimals(state.inputAgreementTokenValue);

    return allowance.gte(tokenValue);

}

export async function createAgreement () {

    const token = state.inputAgreementSelectedToken.address;
    if (!token) {
        throw new Error(`Undefined token address`);
    }

    const recipient = state.inputAgreementRecipientAddress;
    if (!recipient) {
        throw new Error(`Undefined recipient`);
    }

    const tokenValue = calculateWithDecimals(state.inputAgreementTokenValue);
    if (!tokenValue) {
        throw new Error(`Undefined token value`);
    }

    const duration = utils.bigNumberify(state.inputAgreementPeriodCounter)
        .mul(utils.bigNumberify(state.inputAgreementPeriodDuration.value));
    if (!duration) {
        throw new Error(`Undefined duration`);
    }

    const start = utils.bigNumberify(state.inputAgreementStartDate.getTime()).div(1000);
    if (!start) {
        throw new Error(`Undefined start timestamp`);
    }

    const trickleContract = await getTrickleContract();
    const tx = await trickleContract.createAgreement(token, recipient, tokenValue, duration, start);
    const txReceipt = await tx.wait(confirmationsToWait);
    const agreementCreatedEvent = txReceipt.events.find(
        (event) => { return event.event === "AgreementCreated" }
    );

    return agreementCreatedEvent.args[0].toString();

}

export async function cancelAgreement(agreementId) {
    const trickleContract = await getTrickleContract();
    const tx = await trickleContract.cancelAgreement(agreementId);
    await tx.wait(confirmationsToWait);
}

export async function withdrawTokens(agreementId) {
    const trickleContract = await getTrickleContract();
    const tx = await trickleContract.withdrawTokens(agreementId);
    await tx.wait(confirmationsToWait);
}

export async function getCreatedAgreements(recipient = null, sender = null) {
    const contract = await getTrickleContract();
    const provider = await getProvider();

    const filter = contract.filters.AgreementCreated(null, null, recipient, sender);
    filter.fromBlock = await getTrickleBlock();
    const eventEntries = Object.entries(contract.interface.events);

    let logs = await provider.getLogs(filter);
    logs = logs.map((item) => { return eventEntries.find(([,{ name }]) => name === "AgreementCreated")[1].decode(item.data, item.topics) });

    return logs;
}

export async function getCanceledAgreements(recipient = null, sender = null) {
    const contract = await getTrickleContract();
    const provider = await getProvider();

    const filter = contract.filters.AgreementCanceled(null, null, recipient, sender);
    filter.fromBlock = await getTrickleBlock();
    const eventEntries = Object.entries(contract.interface.events);

    let logs = await provider.getLogs(filter);
    logs = logs.map((item) => { return eventEntries.find(([,{ name }]) => name === "AgreementCanceled")[1].decode(item.data, item.topics) });

    return logs;
}

function calculateWithDecimals(value) {
    return utils.bigNumberify(value).mul(
        utils.bigNumberify(10).pow(utils.bigNumberify(state.inputAgreementSelectedToken.decimal)) 
    );
}

async function getTrickleBlock () {
    const provider = await getProvider();
    const net = await provider.getNetwork();
    const netName = (net || {}).name;
    const block = contractsByNetwork[netName].block;

    if (!block) {
        throw new Error(`Trickle contract is not deployed to selected network ${ netName }`);
    }

    return block;

}

export async function getTrickleAddress () {

    const provider = await getProvider();
    const net = await provider.getNetwork();
    const netName = (net || {}).name;
    const address = (contractsByNetwork[netName] || {}).address;

    if (!address) {
        throw new Error(`Trickle contract is not deployed to selected network ${ netName }`);
    }

    return address;

}

async function getTrickleContract () {

    const provider = await getProvider();
    const address = await getTrickleAddress();

    return new Contract(address, contractAbi, provider.getSigner());

}

async function getTokenContract (addr, abi = tokenContractAbi) {

    const address = addr || state.inputAgreementSelectedToken.address;
    if (!address) {
        throw new Error(`Undefined token adress`);
    }

    const provider = await getProvider();

    return new Contract(address, abi, provider.getSigner());

}