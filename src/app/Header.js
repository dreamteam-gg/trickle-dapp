import React, { Component } from "react";
import getProvider from "../ethereum/provider";
import { Toast } from "toaster-js";
import "./Header.scss";
import { DropdownList } from "react-widgets";
import state from "../state";
import { observer } from "mobx-react";
import { infoPagePath } from "../constants";
import { withRouter } from "react-router-dom";
import { getPathForRouter } from "../utils";

@observer
export default class NavBar extends Component {

    state = {
        account: state.currentAccount
    };
    accountUpdateTimeout = 0;
    provider = null;

    async updateFromProvider () {
        if (!this.provider) {
            return;
        }
        const account = (await this.provider.listAccounts())[0];
        if (state.currentAccount != account) {
            state.currentAccount = account;
        }
        const network = await this.provider.getNetwork(); // Always returns the same net, looks like a bug in Ethers
        if (network && network.chainId !== state.currentNetwork.chainId) {
            state.currentNetwork = network;
        }
    }

    async updateFromProviderLoop () {
        await this.updateFromProvider();
        this.accountUpdateTimeout = setTimeout(this.updateFromProviderLoop.bind(this), 100);
    }

    async componentDidMount () {
        try {
            this.provider = await getProvider();
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
        // <input type="submit"
        //        onClick={ () => { history.push(getPathForRouter(indexPagePath)) } }
        //        value="← Back to Home"/>
        <a href="#" onClick={ () => { history.push(getPathForRouter(infoPagePath)) } }>
            <div className="small info icon"/>
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