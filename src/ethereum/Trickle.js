import { Contract } from "ethers";
import contractAbi from "./Trickle-ABI.json";
import getProvider from "./provider";
import { contractsByNetwork } from "../constants";

async function getContract () {

    const provider = await getProvider();
    const net = await provider.getNetwork();
    const netName = (net || {}).name;
    const address = contractsByNetwork[netName];

    if (!address) {
        throw new Error(`Trickle contract is not deployed to selected network ${ netName }`);
    }

    return new Contract(address, contractAbi, provider);

}

// An example of exposed function
export async function getAgreement (agreementId = 100500) {

    const contract = await getContract();

    // await new Promise(r => setTimeout(r, 500)); // TODO: replace simulated delay with getting contract details
    // TODO: calls
    const data = await contract.getAgreement(agreementId);

    return {
        agreementId, // agreementId
        recipient: data.recipient,
        sender: data.sender,
        token: data.token
    };

}