import React, { Component } from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { getPathForRouter } from "../../utils";
import { createAgreementPagePath, demoTokens, myAgreementsPagePath } from "../../constants";
import "./Index.scss";
import state from "../../state";
import ProgressBar from "../components/TokenProgressBar";

@observer
export default class Index extends Component {

    state = {
        tick: 0
    };
    demoInterval = 0;

    async componentDidMount () {
        // TODO: contracts loading logic
        // await contract...
        this.demoInterval = setInterval(() => this.setState({ tick: this.state.tick + 1 }), 2000);
    }

    componentWillUnmount () {
        clearInterval(this.demoInterval);
    }

    CreateAgreementButton = withRouter(({ history }) => (
        <input type="submit"
               onClick={ () => { history.push(getPathForRouter(createAgreementPagePath)) } }
               value="Create New Agreement"/>
    ));

    MyAgreementsButton = withRouter(({ history }) => (
        <input type="submit"
               onClick={ () => { history.push(getPathForRouter(myAgreementsPagePath)) } }
               value={ `My Agreements (${ state.relatedAgreementsLoading
                   ? "..."
                   : state.relatedAgreements.length })` }/>
    ));

    render () {
        const { CreateAgreementButton, MyAgreementsButton } = this;
        return <div className="center index page">
            <div>
                <div className="logo icon"/>
                <h1 className="hidden">Trickle</h1>
                <div className="subtitle">
                    <div>Your hourly pay, cryptographically secured.</div>
                    <div className="subtext">
                        Pay or get paid with tokens or stablecoins, for each second of your work. Today.
                    </div>
                </div>
                <ProgressBar tokenSymbol={ demoTokens[this.state.tick % demoTokens.length] }/>
                <div className="center standard-padding buttons">
                    <CreateAgreementButton/>
                    <MyAgreementsButton/>
                </div>
            </div>
        </div>
    }

}