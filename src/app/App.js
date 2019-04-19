import React, { Component } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "toaster-js/default.scss";
import IndexPage from "./pages/Index.js";

import "./App.scss";

export default class App extends Component {

    render () {
        return [
            <Header/>,
            <IndexPage/>,
            <Footer/>
        ];
    }

}