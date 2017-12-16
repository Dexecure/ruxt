import Head from 'next/head';
import React from 'react';

const Meta = () => (
    <div>
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <meta name="theme-color" content="#F53240" />
            <meta property="og:title" content="Real User Experience Test (RUXtest) | Dexecure" />
            <meta property="og:description" content="User experience results from more than 1.2 million websites accessed from Google Chrome." />
            <meta property="og:type" content="website" />
            <meta property="og:locale" content="en_US" />
            <link rel="icon" type="image/png" href="/static/favicon-32x32.png" sizes="32x32" />
            <link rel="icon" type="image/png" href="/static/favicon-16x16.png" sizes="16x16" />
            <link rel="stylesheet" href="static/css/react-select.css" />
            <link rel="stylesheet" href="static/css/rangeslider.css" />
            <title>Real User Experience Test (RUXtest) | Dexecure</title>
        </Head>
        <style jsx global>{`
            body {
                margin: 0;
                font-family: "source-sans-pro", sans-serif;
                font-size: 1em;
                background-color: #f2f2f2;
            }
            img {
                max-width:100%;
                height:auto;
            }
            .l {
                max-width: 72em;
                margin: 0 auto;
            }
            main {
                padding: 1em;
            }
            .pulseloader {
                width: 100%;
                position: absolute;
                top: 0;
                bottom: 0;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .btn {
                display: inline-block;
                line-height: normal;
                text-decoration: none;
                text-align: center;
                border: 0;
                cursor: pointer;
                font-size: 1rem;
                border-radius: 4px;
                padding: 10px 20px;
                background: #db3340;
                box-shadow: 0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08);
                color: #ffffff;
                transition: .3s background-color ease-in-out;
                -webkit-font-smoothing: antialiased;

            }
            .btn&:hover, .btn&:active {
                transition: .3s background-color ease-in-out;
                background-color: #b11622;
            }
            .btn:disabled {
                opacity: 0.65;
                cursor: not-allowed;
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
            .outer {
                display: flex;
                justify-content: center;
                flex-direction: column;
                align-items: center;
                z-index: -999;
                padding: 1em;
            }
            .container {
                position: relative;
                padding: 1.5em 2em;
                width: 80%;
                box-shadow: 0 5px 5px 0 rgba(0,0,0,0.4),
                            0 3px 1px -2px rgba(0,0,0,0.12),
                            0 1px 5px 0 rgba(0,0,0,0.4);
                background-color: #ffffff;
                z-index: 0;
                border-radius: 4px;
                margin: 0 auto;
            }
      `}
        </style>
    </div>
);
export default Meta;