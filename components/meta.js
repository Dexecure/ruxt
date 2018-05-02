import Head from "next/head";
import React from "react";

const Meta = () => (
  <div>
    <Head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="theme-color" content="#F53240" />
      <meta
        property="og:title"
        content="Real User Experience Test (RUXtest) | Dexecure"
      />
      <meta
        property="og:description"
        content="User experience results from more than 3,237,526 websites accessed from Google Chrome."
      />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta
        property="og:image"
        content="../static/dexecure-facebook-visual.png"
      />

      <link
        rel="icon"
        type="image/png"
        href="../static/favicon-32x32.png"
        sizes="32x32"
      />
      <link
        rel="icon"
        type="image/png"
        href="../static/favicon-16x16.png"
        sizes="16x16"
      />
      <link rel="stylesheet" href="../static/css/main.css" />
      <title>Real User Experience Test (RUXtest) | Dexecure</title>
      {/* Hubspot */}
      <script
        type="text/javascript"
        id="hs-script-loader"
        async
        defer
        src="//js.hs-scripts.com/3845998.js"
      />
    </Head>
    <style jsx global>
      {`
        body {
          margin: 0;
          font-family: "source-sans-pro", sans-serif;
          font-size: 1em;
          background-color: #f2f2f2;
        }
        img {
          max-width: 100%;
          height: auto;
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
          box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11),
            0 1px 3px rgba(0, 0, 0, 0.08);
          color: #ffffff;
          transition: 0.3s background-color ease-in-out;
          -webkit-font-smoothing: antialiased;
        }
        .heading {
          text-align: center;
        }
        .btn&:hover,
        .btn&:active {
          transition: 0.3s background-color ease-in-out;
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
          padding: 1.5em 2em;
          width: 80%;
          box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.4),
            0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.4);
          background-color: #ffffff;
          z-index: 0;
          border-radius: 4px;
          margin: 0 auto;
        }
        .URLInput__wrapper,
        .DeviceInput__wrapper,
        .ConnectionInput__wrapper,
        .TimeInput__wrapper,
        .visual__wrapper,
        .time__wrapper,
        .explanation__wrapper {
          margin: 1em 0.5em;
        }
        .table__wrapper {
          display: flex;
          justify-content: space-around;
          align-items: flex-start;
        }
        .seb__wrapper,
        .fcpProb__wrapper,
        .onloadProb__wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 1em 0.3em;
        }
        .table__header {
          color: #153b58;
          font-size: 1.2em;
        }
        .table__content {
          font-size: 3em;
          color: #db3340;
        }
        .explanation__header {
          color: #153b58;
          font-size: 1.2em;
          padding: 1em 0 0.5em 0;
        }
        @media all and (max-width: 40em) {
          .table__wrapper {
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
        }
        @media all and (min-width: 50em) {
          .DeviceConnection__wrapper {
            display: flex;
          }
          .DeviceInput__wrapper,
          .ConnectionInput__wrapper {
            width: 50%;
          }
          .explanation__row {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
          }
          .explanation__item {
            padding-right: 2em;
          }
        }
        .visual__wrapper {
          position: relative;
        }
        .loader {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .explanation__section {
          padding: 0.3em 0;
        }
        .TimeInput__wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .TimeInput__label {
          max-width: 150px;
          width: 100%;
          margin-right: 5px;
        }
        a {
          color: #db3340;
          border-bottom: 1px dotted;
          text-decoration: none;
        }
        .header--right a {
          color: #f2f2f2;
          border-bottom: none;
        }
        .header--middle {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        .heading {
          text-align: center;
          max-width: 55em;
          padding: 0 0.5em;
          margin: 0 auto;
          font-family: "Europa", "source-sans-pro", sans-serif;
          font-weight: normal;
        }
        .heading h2 {
          font-weight: normal;
        }
        .dashboard--header {
          background-color: #153b58;
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
          border-bottom: none;
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
          max-width: 45em;
        }
        .gitHub-img {
          position: absolute;
          top: 0;
          left: 0;
          border: 0;
        }
      `}
    </style>
  </div>
);
export default Meta;
