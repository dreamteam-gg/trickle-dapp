import { providers } from "ethers";
import { Toast } from "toaster-js";

export default async function getProvider (web3Provider = null) {

    if (!web3Provider) {
        web3Provider = await getWeb3Provider();
    }

    return new providers.Web3Provider(web3Provider.currentProvider);

};

export async function getWeb3Provider () {

    const timeout = setTimeout(() => new Toast("Please, sign in with your crypto wallet", Toast.TYPE_INFO, Toast.TIME_LONG), 5000);

    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            await ethereum.enable();
        } catch (error) {
            clearTimeout(timeout);
            throw new Error("You've denied this app to see your account address.");
        }
    } else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
    } else {
        clearTimeout(timeout);
        throw new Error("Please, install Metamask or browse this application from your mobile Ethereum crypto-wallet");
    }

    clearTimeout(timeout);

    return window.web3;

}