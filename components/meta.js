import Head from "next/head";
import React from "react";

const Meta = () => (
  <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="theme-color" content="#F53240" />
      <meta property="og:title" content="Real User Experience Test (RUXtest) | Dexecure" />
      <meta property="og:description" content="User experience results from more than 1.2 million websites accessed from Google Chrome." />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content="/static/dexecure-facebook-visual.png" />

      <link rel="icon" type="image/png" href="/static/favicon-32x32.png" sizes="32x32" />
      <link rel="icon" type="image/png" href="/static/favicon-16x16.png" sizes="16x16" />
      <link rel="stylesheet" href="static/css/main.css" />
      <link href="http://cdn-images.mailchimp.com/embedcode/classic-10_7.css" rel="stylesheet" type="text/css" />
      <script src="https://code.jquery.com/jquery-2.1.3.min.js"></script>
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
      .heading {
        text-align: center;
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
      .URLInput__wrapper, .DeviceInput__wrapper,
      .ConnectionInput__wrapper, .TimeInput__wrapper,
      .visual__wrapper, .time__wrapper, .explanation__wrapper {
          margin: 1em .5em;
      }
      .table__wrapper {                        
          display: flex;
          justify-content: space-around;
          align-items: flex-start;
      }
      .seb__wrapper, .fcpProb__wrapper, .onloadProb__wrapper {               
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 1em .3em;
      }
      .table__header {
          color: #153B58;
          font-size: 1.2em;
      }
      .table__content {
          font-size: 3em;
          color: #db3340;
      }
      .explanation__header {
          color: #153B58;
          font-size: 1.2em;
          padding: 1em 0 .5em 0;
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
          .DeviceInput__wrapper, .ConnectionInput__wrapper {
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
        padding: .3em 0;
      }
      .TimeInput__wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .TimeInput__label {
        max-width: 150px;
        width:100%;
        margin-right: 5px;
      }
      .switch {
        position: absolute;
        display: inline-block;
        right: 17%;
        width: 125px;
        height: 34px;
      }
      .switch input {display:none;}
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #8bc34a;
        -webkit-transition: .4s;
        transition: .4s;
      }
      .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
      }
      input:checked + .slider:before {
        left: 39px;
      }
      input:checked + .slider {
        background-color: #b2a22d;
      }
      input:focus + .slider {
        box-shadow: 0 0 1px #2196F3;
      }
      input:checked + .slider:before {
        -webkit-transform: translateX(55px);
        -ms-transform: translateX(55px);
        transform: translateX(55px);
      }
      .on {
        padding-right: 17px;
        display: none;
      }
      .on, .off {
        color: white;
        position: absolute;
        transform: translate(-50%,-50%);
        top: 50%;
        left: 50%;
        font-size: 13px;
        font-family: Verdana, sans-serif;
      }
      input:checked+ .slider .on {
        display: block;
      }
      input:checked + .slider .off {
        display: none;
      }
      /* Rounded sliders */
      .slider.round {
        border-radius: 34px;
      }
      .slider.round:before {
        border-radius: 50%;
      }
      @media all and (max-width: 900px) {
        .switch {
          right: 22%;
        }
      }
      @media all and (max-width: 650px) {
        .switch {
          width: 101px;
          right: 36%;
        }
        input:checked + .slider:before {
          left: 18px;
        }
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
          padding: 0 .5em;
          margin: 0 auto;
          font-family: "Europa", "source-sans-pro", sans-serif;
          font-weight: normal;
      }
      .heading h2 {
          font-weight: normal;
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
