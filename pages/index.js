import React from "react";
import Router from "next/router";
import Link from "next/link";
import Head from "next/head";
import Typekit from "react-typekit";
import Meta from "../components/meta";
import { PulseLoader } from "react-spinners";
import { logPageView, initGA } from "../utils/analytics";
import ResultComponent from "../components/result";

class RUXtestApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            emailAlreadyRegistered: false,
            emailEmpty: false,
            backendError: false,
            submitting: false
        };
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
                <div className="svg-background">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 810" preserveAspectRatio="xMinYMin slice" aria-hidden="true"><path fill="#efefee" d="M592.66 0c-15 64.092-30.7 125.285-46.598 183.777C634.056 325.56 748.348 550.932 819.642 809.5h419.672C1184.518 593.727 1083.124 290.064 902.637 0H592.66z"></path><path fill="#f6f6f6" d="M545.962 183.777c-53.796 196.576-111.592 361.156-163.49 490.74 11.7 44.494 22.8 89.49 33.1 134.883h404.07c-71.294-258.468-185.586-483.84-273.68-625.623z"></path><path fill="#f7f7f7" d="M153.89 0c74.094 180.678 161.088 417.448 228.483 674.517C449.67 506.337 527.063 279.465 592.56 0H153.89z"></path><path fill="#fbfbfc" d="M153.89 0H0v809.5h415.57C345.477 500.938 240.884 211.874 153.89 0z"></path><path fill="#ebebec" d="M1144.22 501.538c52.596-134.583 101.492-290.964 134.09-463.343 1.2-6.1 2.3-12.298 3.4-18.497 0-.2.1-.4.1-.6 1.1-6.3 2.3-12.7 3.4-19.098H902.536c105.293 169.28 183.688 343.158 241.684 501.638v-.1z"></path><path fill="#e1e1e1" d="M1285.31 0c-2.2 12.798-4.5 25.597-6.9 38.195C1321.507 86.39 1379.603 158.98 1440 257.168V0h-154.69z"></path><path fill="#e7e7e7" d="M1278.31,38.196C1245.81,209.874 1197.22,365.556 1144.82,499.838L1144.82,503.638C1185.82,615.924 1216.41,720.211 1239.11,809.6L1439.7,810L1439.7,256.768C1379.4,158.78 1321.41,86.288 1278.31,38.195L1278.31,38.196z"></path></svg>
                </div>
                <div className="outer l">
                    <ResultComponent />
                </div>
                <div className="footer--content l">
                    <p>SEB (Site Experience Benchmark) is between 0 and 1. The more the better user experience.</p>
                    <p>FCP (First Contentful Paint) and onload probabilities indicate the fraction of users with FCP and onload finished.</p>
                    <p>1,241,019 websites. Real User Experience for Google Chrome users.</p>
                    <p>Backed by <a href="https://developers.google.com/web/tools/chrome-user-experience-report/">CrUX</a>. Made with <span style={{color: "#db3340"}}>❤</span> by <a href="https://dexecure.com">Dexecure</a>.</p>
                </div>
                <Typekit kitId="rgu6gkq" />
                <style jsx>
                    {`
                        a {
                            color: #db3340;
                            border-bottom: 1px dotted;
                            text-decoration: none;
                        }
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
                        .svg-background {
                            position: absolute;
                            top: 0;
                            bottom: 0;
                            left: 0;
                            right: 0;
                            background-color: #fafafa;
                            z-index: -999;
                            overflow: hidden;
                        }
                        .svg-background svg {
                            height: 100%;
                            width: 100%;
                            position: relative;
                        }
                        .footer--content {
                            padding: 2em 1em;
                            margin: 0 auto;
                            text-align: center;
                            max-width: 40em;
                        }
                        `}
                </style>
            </div>
        );
    }
}

export default RUXtestApp;
