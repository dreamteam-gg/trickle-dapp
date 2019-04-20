import React, { Component } from "react";
import "./TokenProgressBar.scss";

export default class Agreement extends Component {

    static defaultProps = {
        startDate: new Date(),
        duration: 1000 * 60 * 2,
        value: 100, // whole number
        releasedValue: 0,
        decimals: 2,
        tokenSymbol: "USD"
    };

    state = {
        dummy: 0
    };

    componentDidMount () {
        this.timer = setInterval(this.tick, 100);
    }

    componentWillUnmount () {
        clearInterval(this.timer);
    }

    tick = () => this.setState({
        dummy: this.state.dummy + 1
    });

    render () {
        const now = Date.now();
        const start = this.props.startDate.getTime();
        const duration = this.props.duration;
        const ratio = Math.max(0, Math.min(1, ((now - start) / duration)));
        const releasedRatio = Math.max(0, Math.min(1, (this.props.releasedValue / this.props.value)));
        const value = this.props.value * ratio;
        const power = Math.pow(10, this.props.decimals);
        const tokensString = (Math.floor(value * power)).toString().padStart(this.props.decimals + 1, 0);
        const displayValue = `${ tokensString.slice(0, -this.props.decimals) }.${
            tokensString.substr(-this.props.decimals, this.props.decimals)
        }`;
        return <div className="token-progress-bar">
            <div className="wrapper">
                <div className="bar-wrapper">
                    <div className="bar"
                        style={ ({ width: `${ ratio * 100 }%` }) }/>
                    <div className="released-bar"
                        style={ ({ width: `${ releasedRatio * 100 }%` }) }/>
                    <div className="data">
                        <div>{ displayValue } <strong>{ this.props.tokenSymbol }</strong></div>
                        <div className="subtext">of { this.props.value } { this.props.tokenSymbol }</div>
                    </div>
                </div>
                <div className="start subtext date">{ new Date(start).toLocaleString() }</div>
                <div className="end subtext date">{ new Date(start + duration).toLocaleString() }</div>
                <div className="now subtext date" style={ ({
                    left: `${ ratio * 100 }%`
                }) }><div style={ ({
                    transform: `translate(${ -2 * (ratio - 0.5) * 68 }px, 0)`,
                    // textAlign: ratio > 0.5 ? "right" : "left"
                }) }>{ new Date().toLocaleString() }</div></div>
            </div>
        </div>;
    }

}