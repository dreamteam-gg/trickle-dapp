import React, { Component } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "toaster-js/default.scss";
import { getPathForRouter } from "../utils";
import {
    agreementPagePath, confirmAgreementPagePath, createAgreementPagePath, loadingPagePath, myAgreementsPagePath,
    infoPagePath
} from "../constants";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import IndexPage from "./pages/Index";
import CreateAgreement from "./pages/CreateAgreement";
import ConfirmAgreement from "./pages/ConfirmAgreement";
import Agreement from "./pages/Agreement";
import MyAgreements from "./pages/MyAgreements";
import Info from "./pages/Info";
import Loading from "./pages/Loading";

// Enables localization for date inputs
import dateFnsLocalizer from "react-widgets-date-fns";
import simpleNumberLocalizer from "react-widgets-simple-number";
dateFnsLocalizer();
simpleNumberLocalizer();

import "./App.scss";

export default class App extends Component {

    render () {
        return <Router>
            <Header/>
            <div className="page">
                <Switch>
                    <Route exact path={ getPathForRouter(agreementPagePath, {
                        agreementId: ":agreementId"
                    }) } component={ ({ match: { params } }) => <Agreement { ...params }/> } />
                    <Route exact path={ getPathForRouter(confirmAgreementPagePath) } component={ ConfirmAgreement } />
                    <Route exact path={ getPathForRouter(createAgreementPagePath) } component={ CreateAgreement } />
                    <Route exact path={ getPathForRouter(loadingPagePath) } component={ Loading } />
                    <Route exact path={ getPathForRouter(myAgreementsPagePath) } component={ MyAgreements } />
                    <Route exact path={ getPathForRouter(infoPagePath) } component={ Info } />
                    <Route component={ IndexPage } />
                </Switch>
            </div>
            <Footer/>
        </Router>;
    }

}