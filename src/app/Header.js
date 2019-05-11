import React, { Component } from "react";
import getProvider, { getWeb3Provider } from "../ethereum/provider";
import { Toast } from "toaster-js";
import "./Header.scss";
import { DropdownList } from "react-widgets";
import state from "../state";
import { observer } from "mobx-react";
import { infoPagePath, ethNetworksByChainId } from "../constants";
import { withRouter } from "react-router-dom";
import { getPathForRouter } from "../utils";
import { action } from "mobx";

@observer
export default class NavBar extends Component {

    state = {
        account: state.currentAccount
    };
    accountUpdateTimeout = 0;
    provider = null;
    web3Provider = null;

    @action
    async updateFromProvider () {
        if (!this.provider) {
            return;
        }
        const account = (await this.provider.listAccounts())[0];
        if (state.currentAccount != account) {
            state.currentAccount = account;
        }
        let network;
        // this.provider.getNetwork() always returns the same net, looks like a bug in Ethers.js. Using the native method
        do {
            network = await new Promise((res, rej) => this.web3Provider.version.getNetwork((e, r) => e ? rej(e) : res(r)));
            if (!ethNetworksByChainId[network]) {
                new Toast("Unknown web3 network selected. Please, select mainnet or ropsten/kovan testnet", Toast.TYPE_ERROR);
                await new Promise(r => setTimeout(r, 10000));
            }
        } while (!ethNetworksByChainId[network]);
        if (+network != state.currentNetwork.chainId) {
            state.currentNetwork = ethNetworksByChainId[network] || {
                chainId: 0,
                name: "Unknown"
            };
        }
    }

    async updateFromProviderLoop () {
        await this.updateFromProvider();
        this.accountUpdateTimeout = setTimeout(this.updateFromProviderLoop.bind(this), 100);
    }

    async componentDidMount () {
        try {
            this.web3Provider = await getWeb3Provider();
            this.provider = await getProvider(this.web3Provider);
            this.updateFromProviderLoop();
            console.log("Provider", this.provider);
        } catch (e) {
            new Toast(e, Toast.TYPE_ERROR, Toast.TIME_LONG);
        }
    }

    componentWillUnmount () {
        clearTimeout(this.accountUpdateTimeout);
    }

    walletHint = () => {
        new Toast("You can choose another wallet in Metamask or your mobile wallet");
    }

    InfoButton = withRouter(({ history }) => (
        <a href="#" onClick={ () => { history.push(getPathForRouter(infoPagePath)) } }>
            <div className="small question icon"/>
        </a>
    ));

    render () {
        const { InfoButton } = this;
        return <div className="header">
            <div>
                <div className="small user icon"/>
            </div>
            <DropdownList onChange={ this.walletHint }
                          data={ [state.currentAccount, "Select another account..."] }
                          value={ state.currentAccount }/>
            <div>
                <InfoButton/>
            </div>
        </div>
    }

}