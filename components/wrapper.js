import React, { Component } from "react";
import Router from "next/router";
import Typekit from "react-typekit";
import Meta from "../components/meta";
import { PulseLoader } from "react-spinners";
import { logPageView, initGA } from "../utils/analytics";

export default function (SubComponent) {
    return class wrapper extends Component {
        constructor(props) {
            super(props);
        }

        componentDidMount() {
            if (!window.GA_INITIALIZED) {
                initGA();
                window.GA_INITIALIZED = true;
            }
            logPageView();
        }

        render() {
            return (
                <div>
                    <Meta />
                    <header className="dashboard--header">
                        <div className="l">
                            <div className="header--left">
                                <a className="header--logo" href="/">
                                    <img src="static/full-logo-white.png" alt="RUXtest | Dexecure" />
                                </a>
                            </div>
                            <div className="header--right">
                                <a className="btn" href="https://dexecure.com">Try Dexecure</a>
                            </div>
                        </div>
                    </header>
                    <SubComponent {...this.props} />
                    <Typekit kitId="rgu6gkq" />
                    <style jsx>
                        {`
                            .dashboard--header {
                            background-color: #153B58;
                            }
                            .dashboard--header .l {
                            display: flex;
                            justify-content: space-between;
                            padding: 1em;
                            align-items: center;
                            }
                            .header--logo {
                            max-width: 8em;
                            display: inline-block;
                            }
                            .dashboard--logout-image {
                            max-width: 25px;
                            }
                            .dashboard--logout {
                            background-color: #153B58;
                            border: 1px solid #153B58;
                            }
                            .dashboard--logout {
                            cursor: pointer;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            }
                            .dashboard--logout-text {
                            color: #ffffff;
                            padding: .3em .5em;
                            }
                        `}
                    </style>
                </div>
            );
        }
    };
}
