import { Contract, utils } from "ethers";
import contractAbi from "./Trickle-ABI.json";
import tokenContractAbi from "./Token-ABI.json";
import getProvider from "./provider";
import { contractsByNetwork, confirmationsToWait } from "../constants";
import state from "../state";

function calculateWithDecimals(value) {
    return utils.bigNumberify(value).mul(
        utils.bigNumberify(10).pow(utils.bigNumberify(state.inputAgreementSelectedToken.decimal)) 
    );
}

async function getTrickleAddress () {

    const provider = await getProvider();
    const net = await provider.getNetwork();
    const netName = (net || {}).name;
    const address = contractsByNetwork[netName];

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

async function getTokenContract (addr) {

    const address = addr || state.inputAgreementSelectedToken.address;
    if (!address) {
        throw new Error(`Undefined token adress`);
    }

    const provider = await getProvider();

    return new Contract(address, tokenContractAbi, provider.getSigner());

}

export async function getTokenDecimals (address) {

    return await (await getTokenContract(address)).decimals();

}

export async function getTokenSymbol (address) {

    return await (await getTokenContract(address)).symbol();

}

export async function getAgreement (agreementId) {

    const contract = await getTrickleContract();
    const data = await contract.getAgreement(agreementId);

    return {
        agreementId,
        recipient: data.recipient,
        sender: data.sender,
        token: data.token,
        start: data.start,
        duration: data.duration,
        totalAmount: data.totalAmount,
        releasedAmount: data.releasedAmount
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
        throw new Error(`Undefined token adress`);
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
        (event) => { return event.event === 'AgreementCreated' }
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