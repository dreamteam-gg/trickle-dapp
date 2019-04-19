import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { getPathForRouter } from "../../utils";
import { createAgreementPagePath } from "../../constants";
import "./Index.scss";

const CreateAgreementButton = withRouter(({ history }) => (
    <input type="submit"
           onClick={ () => { history.push(getPathForRouter(createAgreementPagePath)) } }
           value="Create Agreement"/>
  ));

export default class Index extends Component {

    render () {
        return <div className="center index page">
            <h1>Trickle</h1>
            <div>
                Your hourly pay, cryptographically secured.
            </div>
            <p>
                [Some fun graphics here]
            </p>
            <div className="center standard-padding">
                <CreateAgreementButton/>
            </div>
        </div>
    }

}