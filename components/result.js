import React from "react";
import qs from "qs";
import Router from "next/router";
import Autosuggest from 'react-autosuggest';
import Select from "react-select";
import Slider from "react-rangeslider";
import debounce from "es6-promise-debounce";
import { PulseLoader } from "react-spinners";
import Visual from "../components/visual";
import Human from "../components/human";

const humanCount = 1000;
const defaultUrl = "https://google.com";
const devAndconDefault = "all";
const deviceList = [
  { value: "all", label: "All device types" },
  { value: "phone", label: "Phone" },
  { value: "tablet", label: "Tablet" },
  { value: "desktop", label: "Desktop" },
];
const connectionList = [
  { value: "all", label: "All connection types" },
  { value: "4G", label: "4G" },
  { value: "3G", label: "3G" },
  { value: "2G", label: "2G" },
  { value: "slow-2G", label: "slow-2G" },
  { value: "offline", label: "offline" },
];

class ResultComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      urlSuggestions: [],
      url: defaultUrl,
      device: devAndconDefault,
      connection: devAndconDefault,
      time: 1,
      fcp: null,
      onload: null,
      fcpHumanCount: 0,
      loadingHumanCount: humanCount,
      onloadHumanCount: 0,
      loading: false,
    };

    this.handleOnURLChange = this.handleOnURLChange.bind(this);
    this.handleOnDeviceChange = this.handleOnDeviceChange.bind(this);
    this.handleOnConnectionChange = this.handleOnConnectionChange.bind(this);
    this.handleGetOrigins = this.handleGetOrigins.bind(this);
    this.handleOnTimeChange = this.handleOnTimeChange.bind(this);
    this.handleUpdateNumbers = this.handleUpdateNumbers.bind(this);
    this.handleUpdateHumanCount = this.handleUpdateHumanCount.bind(this);
  }

  componentDidMount() {
    const { device, connection, url  } = Router.query;
    if (url === undefined && device === undefined && connection === undefined) {
      const basicURL = window.location.pathname;
      Router.push(basicURL, basicURL, { shallow: true });
    } else {
      const newURL = window.location.pathname + "?" +
      qs.stringify({ url: url ? url : defaultUrl, device: device ? device : devAndconDefault,
        connection: connection ? connection : devAndconDefault }, { encode: false });
      Router.push(newURL, newURL, { shallow: true });
      this.setState({
        url: url,
        device: device,
        connection: connection
      });
      this.handleUpdateNumbers(
        url,
        device,
        connection,
      );
    }
  }

  handleOnURLChange(event, { newValue }) {
    const originUrl = { newValue };
    this.setState({
      url: originUrl.newValue,
    });
    if (originUrl) {
      this.handleUpdateNumbers(
        originUrl.newValue,
        this.state.device,
        this.state.connection,
      );
    }

    const { device, connection, url, time } = Router.query;
    const newURL = window.location.pathname + "?" +
      qs.stringify({ url: originUrl.newValue, device: device ? device : devAndconDefault,
        connection: connection ? connection : devAndconDefault }, { encode: false });
    Router.push(newURL, newURL, { shallow: true });
  }

  handleOnDeviceChange(selectedOption) {
    this.setState({
      device: selectedOption,
    });
    if ((this.state.url) || (!(this.state.url = defaultUrl))) {
      this.handleUpdateNumbers(
        this.state.url,
        selectedOption.value,
        this.state.connection,
      );
    }
    const { device, connection, url, time } = Router.query;
    const newURL = window.location.pathname + "?" +
      qs.stringify({ url, device: selectedOption.value, connection }, { encode: false });
    Router.push(newURL, newURL, { shallow: true });
  }

  handleOnConnectionChange(selectedOption) {
    this.setState({
      connection: selectedOption,
    });
    if ((this.state.url) || (!(this.state.url = defaultUrl))) {
      this.handleUpdateNumbers(
        this.state.url,
        this.state.device,
        selectedOption.value,
      );
    }
    const { device, connection, url, time } = Router.query;
    const newURL = window.location.pathname + "?" +
      qs.stringify({ url, device, connection: selectedOption.value }, { encode: false });
    Router.push(newURL, newURL, { shallow: true });
  }

  handleOnTimeChange(selectedOption) {
    if(typeof(selectedOption) === "number") {
      this.setState({
        time: selectedOption,
      });
    }
    this.handleUpdateHumanCount(this.state.fcp, this.state.onload, selectedOption);
  }

  handleGetOrigins(input) {
    if (!input) {
      return Promise.resolve({ options: [] });
    }
    return fetch(`${process.env.BACKEND_URL}/search`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        origin: input,
      }),
    })
      .then(response => response.json())
      .then((json) => {
        return { options: json };
      });
  }

  async handleUpdateNumbers(url, device, connection) {
    this.setState({
      loading: true,
    });
    const origin = url.origin || url;
    const response = await fetch(`${process.env.BACKEND_URL}/content`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        origin,
        device,
        connection,
      }),
    });
    const responseJSON = await response.json();
    if(responseJSON.bam.fcp && responseJSON.bam.onload) {
      this.setState({
        fcp: responseJSON.bam.fcp,
        onload: responseJSON.bam.onload,
        loading: false,
      });
      this.handleUpdateHumanCount(responseJSON.bam.fcp, responseJSON.bam.onload, this.state.time);
    }
  }

  handleUpdateHumanCount(fcp, onload, time) {
    if (time === 0) {
      this.setState({
        onloadHumanCount: 0,
        fcpHumanCount: 0,
        loadingHumanCount: humanCount,
      });
      return;
    }
    const fcp_prob = fcp[time];
    const onload_prob = onload[time];
    const onloadHumanCount = Math.max(0, Math.floor(onload_prob*humanCount));
    const fcpHumanCount = Math.max(0, Math.floor((fcp_prob-onload_prob)*humanCount));
    const loadingHumanCount = Math.max(0, Math.floor(humanCount - fcp_prob*humanCount));
    this.setState({
      onloadHumanCount,
      fcpHumanCount,
      loadingHumanCount,
    });
  }
    
  onUrlSuggestionsFetchRequested = ({ value }) => {
    this.handleGetOrigins(value).then((urls) => {
      this.setState({
        urlSuggestions: urls.options
      })
    });
  };

  onUrlSuggestionsFetchRequested = () => {
    this.setState({
      urlSuggestions: []
    });
  };

  getUrlSuggestionValue(url) {
    return url.origin;
  }
  
  renderUrlSuggestion(url) {
    return (
      <span>{url.origin}</span>
    );
  }

  render() {
    const urlPlaceholder = defaultUrl;
    const formatsecond = value => value + " s";
    const value = this.state.url
    const inputProps = {
      placeholder: urlPlaceholder,
      value,
      onChange: debounce(this.handleOnURLChange, 500)
    };
    return (
      <div className="container">
        <div className="URLInput__wrapper">
        <Autosuggest 
          suggestions={this.state.urlSuggestions}
          onSuggestionsFetchRequested={this.onUrlSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onUrlSuggestionsFetchRequested}
          getSuggestionValue={this.getUrlSuggestionValue}
          renderSuggestion={this.renderUrlSuggestion}
          inputProps={inputProps}
        />
        </div>
        <div className="DeviceConnection__wrapper">
          <div className="DeviceInput__wrapper">
            <Select
              value={this.state.device}
              onChange={debounce(this.handleOnDeviceChange, 500)}
              clearable={false}
              options={deviceList}
              searchable={false}
            />
          </div>
          <div className="ConnectionInput__wrapper">
            <Select
              value={this.state.connection}
              onChange={debounce(this.handleOnConnectionChange, 500)}
              clearable={false}
              searchable={false}
              options={connectionList}
            />
          </div>
        </div>
        <div className="TimeInput__wrapper">
          <span className="TimeInput__label">Time (in seconds):</span>
          <Slider
            min={0}
            max={10}
            value={Number(this.state.time)}
            format={formatsecond}
            tooltip={false}
            handleLabel={this.state.time.toString()}
            onChange={this.handleOnTimeChange}
          />
        </div>
        <div className="visual__wrapper">
          <div className="loader">
            <PulseLoader
              color="#db3340"
              loading={this.state.loading}
              size={30}
            />
          </div>
          <Visual
            fcpHumanCount={this.state.fcpHumanCount}
            onloadHumanCount={this.state.onloadHumanCount}
            loadingHumanCount={this.state.loadingHumanCount}
          />
        </div>
        <div className="table__wrapper">
          <div className="seb__wrapper">
            <span className="table__header" title="Site Experience Benchmark (SEB) score: the fraction of users completing first contentful paint within first second.">
            SEB score
            </span>
            <span className="table__content">
              {((this.state.fcp === null) || (this.state.time === 0) || this.state.fcp[this.state.time] === null) ? "-"
                  : this.state.fcp["1"].toFixed(3)}
            </span>
          </div>
          <div className="fcpProb__wrapper">
            <span className="table__header" title="The percentage of users completing first contentful paint within given time.">
              Users with FCP {((this.state.fcp === null) || (this.state.time === 0) || this.state.fcp[this.state.time] === null) ? ""
                : "<" + this.state.time + "s"}
            </span>
            <span className="table__content">
              {((this.state.fcp === null) || (this.state.time === 0) || this.state.fcp[this.state.time] === null) ? "-"
                : (this.state.fcp[this.state.time] * 100).toFixed(1) + "%"}
            </span>
          </div>
          <div className="onloadProb__wrapper">
            <span className="table__header" title="The percentage of users completing document load within given time.">
              Users with onload {((this.state.onload === null) || (this.state.time === 0) || this.state.onload[this.state.time] === null) ? ""
                : "<" + this.state.time + "s"}
            </span>
            <span className="table__content">
              {((this.state.onload === null) || (this.state.time === 0) || this.state.onload[this.state.time] === null) ? "-"
                : (this.state.onload[this.state.time]*100).toFixed(1)+"%"}
            </span>
          </div>
        </div>
        <div className="explanation__wrapper">
          <div className="explanation__row">
            <div className="explanation__item">
              <div className="explanation__header">
                <span className="explanation__text">
                  How to use the tool
                </span>
              </div>
              <div className="explanation__section">
                <span className="explanation__text">
                  - Select a website using the autocomplete.<br></br>
                  - (Optional) select a device and connection type. <br></br>
                  - Use the time slider to select the user wait time.
                </span>
              </div>
            </div>
            <div className="explanation__item">
              <div className="explanation__header">
                <span className="explanation__text">
                  Assume 1000 website visitors
                </span>
              </div>
              <div className="explanation__section">
                <span className="explanation__text">
                  - <Human color="#ffffff" /> : no content loaded,<br></br>
                  - <Human color="#5486AA" /> : some content loaded,<br></br>
                  - <Human color="#153B58" /> : document loaded.
                </span>
              </div>
            </div>
          </div>
          <div className="explanation__header">
            <span className="explanation__text">
              Metrics
            </span>
          </div>
          <div className="explanation__section">
            <span className="explanation__text">
              - <a href="https://dexecure.com/blog/chrome-user-experience-report-explained-google-bigquery/#diving-into-the-important-questions-wheee">Site Experience Benchmark (SEB)</a> score: the fraction of users completing first contentful paint within first second.<br></br>
              - The percentage of users completing <a href="https://developers.google.com/web/updates/2017/06/user-centric-performance-metrics#first_paint_and_first_contentful_paint">first contentful paint</a> within given time.<br></br>
              - The percentage of users completing document load within given time.<br></br>
            </span>
          </div>
          <div className="explanation__header">
            <span className="explanation__text">
              Learn more
            </span>
          </div>
          <div className="explanation__section">
            <span className="explanation__text">
              - Read more on CrUX and the metrics for user experience in <a href="https://dexecure.com/blog/chrome-user-experience-report-explained-google-bigquery/">the introductory article on CrUX</a>.<br></br>
              - Contribute at <a href="https://github.com/dexecure/ruxt">GitHub</a>. Suggestions welcome.<br></br>
              - Reach out at <a href="mailto:coffee@dexecure.com">coffee@dexecure.com</a>.
            </span>
          </div>
        </div>
        <style jsx>{`
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
        `}
        </style>
      </div>
    );
  }
}

export default ResultComponent;
