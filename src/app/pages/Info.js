import React, { Component } from "react";
import { indexPagePath } from "../../constants";
import { withRouter } from "react-router-dom";
import { getPathForRouter } from "../../utils";
import howToMain from "../img/trickle-howto-main.png";
import howTo0 from "../img/trickle-howto-0.png";
import howTo1 from "../img/trickle-howto-1.png";
import howTo2 from "../img/trickle-howto-2.png";
import howTo3 from "../img/trickle-howto-3.png";
import howTo4 from "../img/trickle-howto-4.png";

import "./Info.scss";

export default class InfoPage extends Component {
    
    BackButton = withRouter(({ history }) => (
        <input type="submit"
               onClick={ () => { history.push(getPathForRouter(indexPagePath)) } }
               value="← Back to Home"/>
    ));

    render () {
        const { BackButton } = this;
        return <div className="standard-padding info-page justified">
            <div className="center buttons">
                <BackButton/>
            </div>
            <h1 className="center">
                <div className="question icon"/>
                Trickle How-To
            </h1>
            <p>
                Trickle is a blockchain application that lets two parties create secure <strong>fixed hourly
                rate</strong> agreements. The smart contract locks the reward for the recipient and releases
                it in a <strong>linear proportion to time</strong>.
            </p>
            <p>
                First of all, smart contracts in Ethereum work with <strong>tokenized</strong> assets, meaning that
                if you want to create a secure agreement in USD or any other currency, you have to purchase
                so-called <strong>stablecoins</strong> on the exchange first (which are 1:1 to USD), and then
                proceed with creating an agreement in stablecoins. Later, you might want to change them back to
                USD at 1:1 rate (excluding a little 1-2% exchange fee).
            </p>
            <div className="center">
                <img src={ howToMain }/>
            </div>
            <h1><u>Step 0.</u> <span className="sub-header">Get Your Crypto Wallet</span></h1>
            <div className="center">
                <img src={ howTo0 }/>
            </div>
            <p>
                If you haven't got any crypto wallet yet, select any which works best for you:
            </p>
            <ul>
                <li><a href="https://metamask.io/" target="_blank">Metamask</a> as a plugin for browsers</li>
                <li><a href="https://trustwallet.com/" target="_blank">Trust</a> as a mobile wallet</li>
                <li><a href="https://trezor.io/" target="_blank">Trezor</a> or <a href="https://trezor.io/" target="_blank">Ledger</a> as hardware wallets (can be plugged to a browser with <a href="https://metamask.io/" target="_blank">Metamask</a>)</li>
                <li>Any other Ethereum wallet of your preference which <strong>has a DApp browser</strong> (can open this web app from the wallet)</li>
            </ul>
            <h1><u>Step 1.</u> <span className="sub-header">Buy Tokens/Stablecoins</span></h1>
            <div className="center">
                <img src={ howTo1 }/>
            </div>
            <p>
                In order to transfer the value using Trickle, obtain some tokens or stablecoins
                at any crypto exchange of your preference. Note that this token/stablecoin <strong>
                    must be an <u>Ethereum-based</u> (ERC20-compatible) token
                </strong>. Trickle is not able to work with other cryptocurrencies (yet).
            </p>
            <p>
                A short list of ERC20-compatible tokens you can use with Trickle:
            </p>
            <ul>
                <li>Stablecoins:&nbsp;
                    <a href="https://makerdao.com/dai/" target="_blank">DAI</a>,&nbsp;
                    <a href="https://www.trusttoken.com/trueusd/" target="_blank">TUSD</a>,&nbsp;
                    <a href="https://www.coinbase.com/usdc" target="_blank">USDC</a>,&nbsp;
                    <a href="https://gemini.com/dollar/" target="_blank">GUSD</a>, ...
                </li>
                <li>Tokens:&nbsp;
                    <a href="https://token.dreamteam.gg/" target="_blank">DREAM</a>,&nbsp;
                    <a href="https://coinmarketcap.com/currencies/binance-coin/" target="_blank">BNB</a>,&nbsp;
                    <a href="https://coinmarketcap.com/currencies/basic-attention-token/" target="_blank">BAT</a>, ...
                </li>
            </ul>
            <p>
                <span className="tiny info icon"/>You can use any other token/stablecoin,
                however, double check whether it's an <strong>Ethereum
                ERC20-compatible token</strong> (Google for it) before purchasing.
            </p>
            <p>
                Here are some of the most popular exchanges you can trade tokens/stablecoins at:
            </p>
            <ul>
                <li><a href="https://www.binance.com" target="_blank">Binance</a></li>
                <li><a href="https://international.bittrex.com" target="_blank">Bittrex</a></li>
                <li><a href="https://www.bitfinex.com/" target="_blank">Bitfinex</a></li>
                <li>...</li>
            </ul>
            <p>
                <span className="tiny info icon"/>Note that some exchanges might be better for a
                particular <strong>country</strong> than others, some of them may have a complex <strong>KYC</strong> (know your customer)
                procedures and different withdrawal <strong>fees</strong>. Make sure you are acknowledged with main exchange terms
                before deciding to go further.
            </p>
            <p>
                <span className="tiny info icon"/>In addition to a token/stablecoin of
                your choice, <strong>you have to purchase ETH</strong> - the Ethereum native currency, which
                is required in order <strong>to do transactions</strong> in the network. Luckily, $1 worth
                of ETH is enough for many transactions (it depends, but usually it's enough for ~10 transactions
                at 3 GWei gas price).
            </p>
            <p>
                Finally, after purchasing some stablecoins for the agreement creation and ETH for making some transactions
                in Ethereum network, withdraw them from the exchange to your Ethereum wallet address.
            </p>
            <h1><u>Step 2.</u> <span className="sub-header">Create an Agreement</span></h1>
            <div className="center">
                <img src={ howTo2 }/>
            </div>
            <p>
                In order to create an agreement with Trickle, you need to agree on the following with your party:
            </p>
            <ul>
                <li>The recipient's Ethereum address (wallet)</li>
                <li>Amount in tokens/stablecoins, which will be evenly distributed over the entire period</li>
                <li>The period itself (when it begins and its duration)</li>
            </ul>
            <p>
                When you enter this information on the "Create a New Agreement" page,
                click <strong>Confirm</strong> and double check all the details of the agreement. Trickle will let 
                you know if your balance is low or something wrong with the data you've entered.
            </p>
            <p>
                Now, in order to create the agreement, click on <strong>Approve Tokens</strong> and
                then <strong>Create Agreement</strong> button. The token approval is required only once
                for a new token.
            </p>
            <p>
                <span className="tiny info icon"/>Make sure you've opened Trickle from the account which has
                tokens/stablecoins and Ether on its balance. In Metamask, as well as in mobile wallets, you
                can switch accounts, and this will also switch a current account which you see at the top of
                the Trickle app.
            </p>
            <p>
                <span className="tiny info icon"/>After the agreement is created, the specified amount of tokens/stablecoins
                will be locked on a smart contract and distributed linearly over the entire period for the recipient. The only
                option to send these tokens back to the contract creator's account is to cancel the agreement.
            </p>
            <p>
                Once the agreement is created, you'll be redirected to the agreement page. You can copy the URL
                (or the agreement ID) and send it to the recipient. At any moment later, both the agreement creator
                and the recipient can find this agreement on "<strong>My Agreements</strong>" screen.
            </p>
            <h1><u>Step 3.</u> <span className="sub-header">Get Tokens/Stablecoins</span></h1>
            <div className="center">
                <img src={ howTo3 }/>
            </div>
            <p>
                Once the agreement is created, you'll see the progress bar and the number of tokens/stablecoins
                available for withdrawal. Both the agreement creator and the recipient can withdraw tokens, but
                they always go to the recipient's address. The number of withdrawals is unlimited, however, the
                tokens/stablecoins the recipient gets are always capped by the linear proportion to the time elapsed.
            </p>
            <p>
                <span className="tiny info icon"/>When <strong>canceling</strong> the agreement, the recipient gets
                all accrued tokens/stablecoins to time, while the contract creator gets those tokens which are left.
            </p>
            <h1><u>Step 4.</u> <span className="sub-header">Manage Your Assets!</span></h1>
            <div className="center">
                <img src={ howTo4 }/>
            </div>
            <p>
                You can either simply change tokens or stablecoins <strong>back</strong> to fiat currency
                using the exchange, or keep them for any later crypto agreements. Welcome to the
                decentralized world!
            </p>
            <p>
                <span className="tiny info icon"/>Still, have questions? Ask <a href="https://github.com/dreamteam-gg/trickle-dapp/issues" target="_blank">here</a> by creating an issue. We'll be happy to help!
            </p>
            <h1>More About Trickle</h1>
            <ul>
                <li><a target="_blank" href="https://github.com/dreamteam-gg/trickle-dapp">Trickle DApp Repository (for questions, issues, pull requests and wishes)</a></li>
                <li><a target="_blank" href="https://devpost.com/software/trickle">Trickle at DevPost</a></li>
                <li><a target="_blank" href="https://www.youtube.com/watch?v=6jz8Vux31BQ">Demo Video</a></li>
                <li><a target="_blank" href="https://www.cryptocompare.com/coins/guides/dreamteam-the-first-esports-and-gaming-recruitment-and-management-network/">What is DreamTeam?</a></li>
            </ul>
            <p>
                Trickle is brought to you by <a href="https://dreamteam.gg/" target="_blank">DreamTeam</a> and its engineers <a href="https://beresnev.pro" target="_blank">Kirill Beresnev</a> and <a href="https://nikita.tk" target="_blank">Nikita Savchenko</a>.
                Trickle is a <a href="https://medium.com/the-ethereum-name-service/trickle-dtok-and-more-meet-the-ens-winners-at-ethcapetown-ebf160bd9e78" target="_blank">winning project</a> of <a href="https://ethcapetown.com/" target="_blank">ETHCapeTown</a> – the global Ethereum hackathon!
            </p>
            <p>
                <a href="https://token.dreamteam.gg/" target="_blank">DreamTeam</a> and its engineers
                maintain Trickle as a part of DreamTeam's <a href="https://medium.com/dreamteam-gg/dreamteam-tokenomics-7a6366949239" target="_blank">compensations smart contracts PoC</a>.
                This open-source application was audited and is 100% ready for any third-party use.
            </p>
            <div className="center buttons">
                <BackButton/>
            </div>
        </div>
    }

}